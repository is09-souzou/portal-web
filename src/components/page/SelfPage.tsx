import React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import { PageComponentProps } from "../../App";

export default class extends React.Component<PageComponentProps<{}>> {

    componentWillMount() {
        this.setState({});
    }

    render() {
        const {
            auth,
            errorListener
        } = this.props;

        if (!auth.token)
            return "";

        return (
            <Query query={QueryGetUser} variables={{ id: auth.token.payload.sub }}>
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
                            {data && data.getUser}
                        </div>
                    );
                }}
            </Query>
        );
    }
}
