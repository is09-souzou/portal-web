import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link/lib/types";
import gql from "graphql-tag";
import React, { useContext, Fragment } from "react";
import { Query, QueryResult } from "react-apollo";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import LocationText from "src/components/atoms/LocationText";
import Page from "src/components/atoms/Page";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import { UserConnection } from "src/graphQL/type";
import getTagsByURLQueryParam from "src/util/getTagsByURLQueryParam";

const QueryGetUserList = gql(`
    query($limit: Int, $exclusiveStartKey: ID) {
        listUsers(limit: $limit, exclusiveStartKey: $exclusiveStartKey) {
            items {
                id
                displayName
            }
        }
    }
`);

export default (props: React.Props<{}>) => {
    const notification = useContext(NotificationContext);

    return (
        <Page
            ref={props.ref as any}
            {...props}
        >
            <Header
                title={<LocationText text="User list"/>}
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
                            notification={notification}
                            query={query}
                        />
                    )
                )}
            </Query>
        </Page>
    );
};

const UserListPage = (
    {
        query: {
            data,
            fetchMore
        }
    }: {
        notification: NotificationValue,
        query: QueryResult<any, {
            limit: number;
        }>
    }
) => {

    const userConnection = data.listUsers as UserConnection;

    return (
        <div>
            <List>
                {data.listUsers.items.map((user: any) => <ListItem key={user.id}>
                    <ListItemText primary={user.displayName} secondary={user.id} />
                </ListItem>)}
            </List>
            <StreamSpinner
                key={`spinner-${userConnection && userConnection.exclusiveStartKey}.join("_")}`}
                disable={!userConnection.exclusiveStartKey ? true : false}
                onVisible={handleStreamSpinnerVisible(userConnection, fetchMore)}
            />
        </div>
    );
};

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
