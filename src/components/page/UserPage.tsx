import React from "react";
import { Query } from "react-apollo";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import { PageComponentProps } from "./../../App";

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>> {

    render() {

        const {
            errorListener
        } = this.props;

        return (
            <Query query={QueryGetUser} variables={{ id: this.props.computedMatch!.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) {
                        return ([
                            <div key="page">cry；；</div>,
                            <errorListener.ErrorComponent error={error} key="error"/>
                        ]);
                    }

                    console.log(data);
                    return (
                        <div>
                            {data.getUser}
                        </div>
                    );
                }}
            </Query>
        );
    }
}
