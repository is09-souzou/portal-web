import React, { ReactChild } from "react";
import { ApolloProvider }   from "react-apollo";
import config               from "../../config";
import { AuthProps }        from "./Auth";
import { Rehydrated }       from "aws-appsync-react";
import { AWSAppSyncClient } from "aws-appsync";

interface Props extends AuthProps {
    children: ReactChild;
}

interface State {
    client: any;
}

export default class extends React.Component<Props, State> {

    state = {
        client: new AWSAppSyncClient({
            url: this.props.auth.token ? config.appSync.graphqlEndpoint : config.publicAppSync.graphqlEndpoint,
            region: config.appSync.region,
            auth: {
                type: this.props.auth.token ? config.appSync.authenticationType : config.publicAppSync.authenticationType,
                jwtToken: () => this.props.auth.token ? this.props.auth.token.jwtToken : "",
                apiKey: config.publicAppSync.apiKey
            }
        })
    };

    render () {
        const {
            auth,
            children,
            ...props
        } = this.props;

        return (
            <ApolloProvider client={this.state.client as any}>
                <Rehydrated>
                    {children &&
                        React.cloneElement(
                            children as React.ReactElement<AuthProps>,
                            {
                                auth,
                                ...props
                            }
                        )
                    }
                </Rehydrated>
            </ApolloProvider>
        );
    }
}
