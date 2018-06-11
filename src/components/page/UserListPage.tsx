import React from "react";
import { Query } from "react-apollo";
import QueryAllUsers from "../../GraphQL/query/QueryGetUserList";
import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import { PageComponentProps } from "../../App";

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>>{

    render() {

        const {
            errorListener
        } = this.props;

        return (
            <Query query={QueryAllUsers} variables={{ limit: 20 }}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) {
                        return ([
                            <div key="page">cry；；</div>,
                            <errorListener.ErrorComponent error={error} key="error"/>
                        ]);
                    }

                    return (
                        <div>
                            <List>
                                {data.listUsers.items.map((user: any) =>
                                    <ListItem key={user.id}>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.id}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </div>
                    );
                }}
            </Query>
        );
    }
}
