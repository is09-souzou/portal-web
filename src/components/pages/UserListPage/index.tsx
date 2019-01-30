import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link/lib/types";
import gql from "graphql-tag";
import React, { useEffect, useState, Fragment } from "react";
import { Query } from "react-apollo";
import getUsersBySearchWords from "src/api/search/getUsersBySearchWords";
import toArrayFromQueryString from "src/api/toArrayFromQueryString";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import LocationText from "src/components/atoms/LocationText";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import UserList from "src/components/atoms/UserList";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import Host from "src/components/pages/WorkListPage/Host";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { UserConnection } from "src/graphQL/type";
import arraysEqual from "src/util/arraysEqual";

export default React.forwardRef((props, ref) => (
    <RouterHistoryContext.Consumer>
        {routerHistory => (
            <NotificationContext.Consumer>
                {notification => (
                    <UserListPageWrapper
                        routerHistory={routerHistory}
                        notification={notification}
                        {...props}
                        ref={ref as any}
                    />
                )}
            </NotificationContext.Consumer>
        )}
    </RouterHistoryContext.Consumer>
));

const QueryGetUserList = gql(`
    query($limit: Int, $exclusiveStartKey: ID, ) {
        listUsers(limit: $limit, exclusiveStartKey: $exclusiveStartKey) {
            items {
                id
                displayName
                avatarUri
                works(limit: $limit) {
                    items {
                        id
                        userId
                    }
                }
            }
        }
    }
`);

interface UserListPageWrapperProps extends React.Props<{}> {
    routerHistory: RouterHistoryValue;
    notification: NotificationValue;
}

interface State {
    searchWordList: string[];
    // For Elasticsearch result
    userConnection?: UserConnection;
    // For Elasticsearch loading state
    loading: boolean;
}

// https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
// After corresponding to getSnapshotBeforeUpdate of React Hooks, migrate to React Hooks
class UserListPageWrapper extends React.Component<UserListPageWrapperProps, State> {

    constructor(props: UserListPageWrapperProps) {
        super(props);
        const searchWordList = toArrayFromQueryString("search", this.props.routerHistory.history);

        this.state = {
            searchWordList,
            loading: false
        };
    }

    async displaySearchResult() {
        this.setState({ loading: true });
        const userConnection = await getUsersBySearchWords(this.state.searchWordList);
        this.setState({ userConnection, loading: false });
    }

    componentDidMount() {
        if (this.state.searchWordList.length !== 0) {
            this.displaySearchResult();
        }
    }

    componentDidUpdate() {}

    getSnapshotBeforeUpdate() {
        const searchWordList = toArrayFromQueryString("search", this.props.routerHistory.history);
        if (!arraysEqual(searchWordList, this.state.searchWordList)) {
            this.setState(
                {
                    searchWordList
                },
                () => this.displaySearchResult()
            );
        }
        return null;
    }

    render() {

        const {
            routerHistory,
            notification,
            ...props
        } = this.props;

        if (this.state.searchWordList.length === 0) {
            return (
                <Host
                    ref={props.ref as any}
                    {...props}
                >
                    <Header
                        title={<LocationText text="User list"/>}
                        searchable={true}
                    />
                    <Query
                        query={QueryGetUserList}
                        variables={{ limit: 16 }}
                        fetchPolicy="cache-and-network"
                    >
                        {query => (
                            query.loading                                                       ? <GraphQLProgress/>
                          : query.error                                                         ? (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notification.ErrorComponent message={query.error.message}/>
                                </Fragment>
                            )
                          : !(query.data && query.data.listUsers && query.data.listUsers.items) ? <NotFound/>
                          :                                                                       (
                                <UserListPage
                                    userConnection={query.data.listUsers}
                                    fetchMore={handleStreamSpinnerVisible(query.data.listUsers, query.fetchMore)}
                                />
                            )
                        )}
                    </Query>
                </Host>
            );
        }

        return (
            <Host
                ref={props.ref as any}
                {...props}
            >
                <Header
                    title={<LocationText text="User list"/>}
                    searchable={true}
                />
                {
                    this.state.loading                         ? <GraphQLProgress/>
                  : !(
                        this.state.userConnection
                     && this.state.userConnection.items
                     && this.state.userConnection.items.length !== 0
                     )                                         ? <NotFound/>
                  :                                              (
                        <UserListPage
                            userConnection={this.state.userConnection}
                            fetchMore={() => undefined}
                        />
                    )
                }
            </Host>
        );
    }
}

const handleStreamSpinnerVisible = (
    userConnection: UserConnection,
    fetchMore: (<K extends "limit">(fetchMoreOptions: FetchMoreQueryOptions<{
        limit: number;
    }, K> & FetchMoreOptions<any, {
        limit: number;
    }>) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
        query: DocumentNode;
    } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>)
) => () => {
    if (userConnection && userConnection.exclusiveStartKey)
        fetchMore<any>({
            variables: {
                exclusiveStartKey: userConnection.exclusiveStartKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) =>
                previousResult.listUsers.items.length ? ({
                    listUsers: {
                        __typename: previousResult.listUsers.__typename,
                        items: (
                            [
                                ...previousResult.listUsers.items,
                                ...fetchMoreResult.listUsers.items
                            ].filter((x, i, self) => (
                                self.findIndex(y => y.id === x.id) === i
                            ))
                        ),
                        exclusiveStartKey: fetchMoreResult.listUsers.exclusiveStartKey
                    }
                })                                    : previousResult
        });
};

const UserListPage = (
    {
        fetchMore,
        userConnection
    }: {
        fetchMore: () => void,
        userConnection: UserConnection
    }
) => {
    const [userListRow, setUserListRow] = useState<number>(4);

    useEffect(
        () => {
            const resize = () => {
                const row = getRow();
                if (row !== userListRow)
                    setUserListRow(row);
                else
                    setUserListRow(userListRow);
            };
            resize();
            window.addEventListener("resize", resize);

            return () => window.removeEventListener("resize", resize);
        },
        []
    );
    return (
        <div>
            <UserList
                users={userConnection.items}
                userListRow={userListRow}
                onUserItemClick={() => undefined}
            />
            <StreamSpinner
                key={`spinner-${userConnection && userConnection.exclusiveStartKey}.join("_")}`}
                disable={!userConnection.exclusiveStartKey ? true : false}
                onVisible={fetchMore}
            />
        </div>
    );
};

const getRow = () => (
    window.innerWidth > 767 ?
        window.innerWidth > 1020 ? 4
      : window.innerWidth > 840  ? 3
      :                            2
  :
        window.innerWidth > 600  ? 3
      : window.innerWidth > 480  ? 2
      :                            1
);
