import React from "react";
import { graphql, compose } from "react-apollo";
import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import QueryAllUsers from "../../GraphQL/QueryGetUserList";
import QueryGetUser from "../../GraphQL/QueryGetUser";

interface PropsState {
    users: any[];
}

class UserListPage extends React.Component<PropsState> {

    render() {
        const {
            users = []
        } = this.props;

        return (
            <div>
                <List>
                    {users.map(user =>
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
    }
}

export default compose(
    graphql(
        QueryAllUsers,
        {
            options: {
                fetchPolicy: "cache-and-network",
            },
            props: ({ data: { listUsers = { items: [] } } }: any) => ({
                users: listUsers.items,
            })
        }
    ),
    graphql(
        QueryGetUser,
        {
            options: ({ userId: id }: any) => ({
                fetchPolicy: "cache-and-network",
                variables: { id }
            }),
            props: ({ data }) => ({
                data,
            })
        }
    )
)(UserListPage);
