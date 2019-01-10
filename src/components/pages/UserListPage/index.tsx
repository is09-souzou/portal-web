import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useContext, Fragment } from "react";
import { Query, QueryResult } from "react-apollo";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import LocationText from "src/components/atoms/LocationText";
import Page from "src/components/atoms/Page";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";

const QueryGetUserList = gql(`
    query($limit: Int, $nextToken: ID) {
        listUsers(limit: $limit, nextToken: $nextToken) {
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
                variables={{ limit: 20 }}
                fetchPolicy="cache-and-network"
            >
                {query => (
                    query.loading                                                       ? <GraphQLProgress/>
                  : query.error                                                         ? (
                        <Fragment>
                            <ErrorTemplate/>
                            <notification.ErrorComponent error={query.error}/>
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
            data
        }
    }: {
        notification: NotificationValue,
        query: QueryResult<any, {
            limit: number;
        }>
    }
) => {
    return (
        <div>
            <List>
                {data.listUsers.items.map((user: any) => <ListItem key={user.id}>
                    <ListItemText primary={user.displayName} secondary={user.id} />
                </ListItem>)}
            </List>
        </div>
    );
};
