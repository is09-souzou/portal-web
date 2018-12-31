import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Page from "src/components/atoms/Page";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import { PageComponentProps } from "src/App";

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

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>>{

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query query={QueryGetUserList} variables={{ limit: 20 }} fetchPolicy="cache-and-network">
                    {({ loading, error, data }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            return (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notificationListener.ErrorComponent error={error} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!data.listUsers || !data.listUsers.items)
                            return <NotFound/>;

                        return (
                            <div>
                                <List>
                                    {data.listUsers.items.map((user: any) =>
                                        <ListItem key={user.id}>
                                            <ListItemText
                                                primary={user.displayName}
                                                secondary={user.id}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </div>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}
