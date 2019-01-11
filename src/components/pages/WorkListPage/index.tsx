import AddIcon from "@material-ui/icons/Add";
import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link/lib/types";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { Query, QueryResult } from "react-apollo";
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
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import NotificationContext from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { Work, WorkConnection } from "src/graphQL/type";
import getTagsByURLQueryParam from "src/util/getTagsByURLQueryParam";

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
                userId
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

export default (props: React.Props<{}>) => {
    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);
    const routerHistory = useContext(RouterHistoryContext);

    return (
        <Host
            ref={props.ref as any}
            {...props}
        >
            <Header
                title={<LocationText text="Works"/>}
            />
            <Query
                query={QueryListWorks}
                variables={{
                    limit: 15,
                    exclusiveStartKey: null,
                    option: {
                        tags: getTagsByURLQueryParam(routerHistory.history)
                    }
                }}
                fetchPolicy="network-only"
            >
                {(query => (
                    query.loading || !query.data.listWorks ? <GraphQLProgress/>
                  : query.error                            ? (
                        <Fragment>
                            <ErrorTemplate/>
                            <notification.ErrorComponent message={query.error.message}/>
                        </Fragment>
                    )
                  : !(query.data && query.data.listWorks && query.data.listWorks.items.length !== 0)  ? <NotFound/>
                  :                                          (
                        <WorkListPage
                            auth={auth}
                            routerHistory={routerHistory}
                            query={query}
                        />
                    )
                ))}
            </Query>
            <Fab
                onClick={() => routerHistory. history.push("/works/create-work")}
            >
                <AddIcon />
            </Fab>
        </Host>
    );
};

interface Props extends React.Props<{}> {
    auth: AuthValue;
    routerHistory: RouterHistoryValue;
    query: QueryResult<any, {
        limit: number;
        exclusiveStartKey: null;
        option: {
            tags: string[];
        };
    }>;
}

const WorkListPage = (
    {
        auth,
        routerHistory,
        query: {
            data,
            fetchMore
        }
    }: Props
) => {
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

    const workConnection = data.listWorks as WorkConnection;

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
                key={`spinner-${workConnection && workConnection.exclusiveStartKey}-${getTagsByURLQueryParam(routerHistory.history).join("_")}`}
                disable={!workConnection.exclusiveStartKey ? true : false}
                onVisible={handleStreamSpinnerVisible(workConnection, fetchMore)}
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

const handleStreamSpinnerVisible = (
    workConnection: WorkConnection,
    fetchMore: (<K extends "limit" | "exclusiveStartKey" | "option">(fetchMoreOptions: FetchMoreQueryOptions<{
        limit: number;
        exclusiveStartKey: null;
        option: {
            tags: string[];
        };
    }, K> & FetchMoreOptions<any, {
        limit: number;
        exclusiveStartKey: null;
        option: {
            tags: string[];
        };
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
                previousResult.listWorks.items.length ? ({
                    listWorks: {
                        __typename: previousResult.listWorks.__typename,
                        items: (
                            [
                                ...previousResult.listWorks.items,
                                ...fetchMoreResult.listWorks.items
                            ].filter((x, i, self) => (
                                self.findIndex(y => y.id === x.id) === i
                            ))
                        ),
                        exclusiveStartKey: fetchMoreResult.listWorks.exclusiveStartKey
                    }
                })                                    : previousResult
        });
};
