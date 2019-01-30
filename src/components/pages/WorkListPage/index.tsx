import AddIcon from "@material-ui/icons/Add";
import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link/lib/types";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { Query } from "react-apollo";
import getWorksBySearchWords from "src/api/search/getWorksBySearchWords";
import toArrayFromQueryString from "src/api/toArrayFromQueryString";
import Fab from "src/components/atoms/Fab";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import LocationText from "src/components/atoms/LocationText";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import WorkList from "src/components/atoms/WorkList";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import WorkDialog from "src/components/organisms/WorkDialog";
import Host from "src/components/pages/WorkListPage/Host";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import AuthContext from "src/contexts/AuthContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { Work, WorkConnection } from "src/graphQL/type";
import arraysEqual from "src/util/arraysEqual";

export default React.forwardRef((props, ref) => (
    <RouterHistoryContext.Consumer>
        {routerHistory => (
            <NotificationContext.Consumer>
                {notification => (
                    <WorkListPageWrapper
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

const QueryListWorks = gql(`
    query($limit: Int, $exclusiveStartKey: ID, $option: WorkQueryOption) {
        listWorks (
            limit: $limit,
            exclusiveStartKey: $exclusiveStartKey,
            option: $option
        ) {
            items {
                id
                userId
                imageUrl
                user {
                    displayName
                    message
                    avatarUri
                }
                title
                tags
                description
                createdAt
            }
            exclusiveStartKey
        }
    }
`);

interface WorkListPageWrapperProps extends React.Props<{}> {
    routerHistory: RouterHistoryValue;
    notification: NotificationValue;
}

interface State {
    searchWordList: string[];
    // For Elasticsearch result
    workConnection?: WorkConnection;
    // For Elasticsearch loading state
    loading: boolean;
}

class WorkListPageWrapper extends React.Component<WorkListPageWrapperProps, State> {

    constructor(props: WorkListPageWrapperProps) {
        super(props);
        const searchWordList = toArrayFromQueryString("search", this.props.routerHistory.history);

        this.state = {
            searchWordList,
            loading: false
        };
    }

    async displaySearchResult() {
        this.setState({ loading: true });
        const workConnection = await getWorksBySearchWords(this.state.searchWordList);
        this.setState({ workConnection, loading: false });
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
                >
                    <Header
                        title={<LocationText text="Works"/>}
                        searchable={true}
                    />
                    <Query
                        query={QueryListWorks}
                        variables={{
                            limit: 15,
                            option: {
                                tags: toArrayFromQueryString("tags", routerHistory.history)
                            }
                        }}
                        fetchPolicy="network-only"
                    >
                        {query => (
                            query.loading                                                     ?  <GraphQLProgress/>
                          : query.error                                                       ? (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notification.ErrorComponent message={query.error.message}/>
                                </Fragment>
                            )
                        : !(query.data && query.data.listWorks && query.data.listWorks.items) ? <NotFound/>
                        :                                                                       (
                                <WorkListPage
                                    workConnection={query.data.listWorks}
                                    routerHistory={routerHistory}
                                    fetchMore={handleStreamSpinnerVisible(query.data.listWorks, query.fetchMore)}
                                />
                            )
                        )}
                    </Query>
                    <Fab
                        onClick={() => routerHistory. history.push("/works/create-work")}
                    >
                        <AddIcon />
                    </Fab>
                </Host>
            );
        }

        return (
            <Host
                ref={props.ref as any}
                {...props}
            >
                <Header
                    title={<LocationText text="Work list"/>}
                    searchable={true}
                />
                {
                    this.state.loading                         ? <GraphQLProgress/>
                  : !(
                        this.state.workConnection
                     && this.state.workConnection.items
                     && this.state.workConnection.items.length !== 0
                   )                                           ? <NotFound/>
                  :                                              (
                        <WorkListPage
                            workConnection={this.state.workConnection}
                            routerHistory={routerHistory}
                            fetchMore={() => undefined}
                        />
                    )
                }
            </Host>
        );
    }
}

const handleStreamSpinnerVisible = (
    workConnection: WorkConnection,
    fetchMore: (<K extends "limit">(fetchMoreOptions: FetchMoreQueryOptions<{
        limit: number;
    }, K> & FetchMoreOptions<any, {
        limit: number;
    }>) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
        query: DocumentNode;
    } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>)
) => () => {
    if (workConnection && workConnection.exclusiveStartKey)
        fetchMore<any>({
            variables: {
                exclusiveStartKey: workConnection.exclusiveStartKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) =>
                ({
                    listWorks: {
                        __typename: fetchMoreResult.listWorks.__typename,
                        items: (
                            ((previousResult.listWorks.items || []) as Work[])
                                .concat(fetchMoreResult.listWorks.items || [])
                                .filter((x, i, self) => (
                                    self.findIndex(y => y.id === x.id) === i
                                ))
                        ),
                        exclusiveStartKey: fetchMoreResult.listWorks.exclusiveStartKey
                    }
                })
        });
};

const WorkListPage = (
    {
        fetchMore,
        routerHistory,
        workConnection
    }: {
        fetchMore: () => void,
        routerHistory: RouterHistoryValue,
        workConnection: WorkConnection
    }
) => {
    const auth = useContext(AuthContext);
    const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
    const [workDialogOpend, setWorkDialogOpen] = useState<boolean>(false);
    const [workListRow, setWorkListRow] = useState<number>(4);

    useEffect(
        () => {
            const resize = () => {
                const row = getRow();
                if (row !== workListRow)
                    setWorkListRow(row);
                else
                    setWorkListRow(workListRow);
            };
            resize();
            window.addEventListener("resize", resize);

            return () => window.removeEventListener("resize", resize);
        },
        []
    );

    return (
        <Fragment>
            <WorkList
                works={workConnection.items}
                workListRow={workListRow}
                onWorkItemClick={(x: Work) => {
                    setWorkDialogOpen(true);
                    setSelectedWork(x);
                }}
            />
            <StreamSpinner
                key={`spinner-${workConnection && workConnection.exclusiveStartKey}-${toArrayFromQueryString("tags", routerHistory.history).join("_")}`}
                disable={!workConnection.exclusiveStartKey ? true : false}
                onVisible={fetchMore}
            />
            <WorkDialog
                editable={false}
                open={workDialogOpend}
                onClose={() => setWorkDialogOpen(false)}
                work={selectedWork}
                userId={auth.token ? auth.token.payload.sub : ""}
            />
        </Fragment>
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
