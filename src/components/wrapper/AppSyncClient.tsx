declare const require: any;
import React, { ReactNode } from "react";
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/141
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/48
const { Rehydrated }       = require("aws-appsync-react");
const { AUTH_TYPE }        = require("aws-appsync/lib/link/auth-link");
const { AWSAppSyncClient } = require("aws-appsync");
import { ApolloProvider }   from "react-apollo";
import config from "../../config";
import { AuthProps } from "./Auth";

interface Props extends AuthProps {
    children: ReactNode;
}

interface State {
    client: any;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            client: new AWSAppSyncClient({
                url: config.appSync.graphqlEndpoint,
                region: config.appSync.region,
                auth: {
                    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                    jwtToken: () => this.props.auth.jwtToken
                }
            })
        });
    }

    render () {
        const {
            auth,
            children,
            ...props
        } = this.props;

        return (
            <ApolloProvider client={this.state.client}>
                <Rehydrated>
                    {children &&
                        React.cloneElement(
                            children as React.ReactElement<AuthProps>,
                            this.props
                        )
                    }
                </Rehydrated>
            </ApolloProvider>
        );
    }
}
