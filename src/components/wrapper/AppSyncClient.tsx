declare const require: any;
import React from "react";
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/141
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/48
const { Rehydrated }       = require("aws-appsync-react");
const { AUTH_TYPE }        = require("aws-appsync/lib/link/auth-link");
const { AWSAppSyncClient } = require("aws-appsync");
import { ApolloProvider }   from "react-apollo";
import config from "../../config";

interface PropsModel {
    auth: any;
    children: JSX.Element;
}

interface StateModel {
    client: any;
}

export default class extends React.Component<PropsModel, StateModel> {

    state = {
        client: new AWSAppSyncClient({
            url: config.appSync.graphqlEndpoint,
            region: config.appSync.region,
            auth: {
                type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                jwtToken: () => this.props.auth.jwtToken
            }
        })
    };

    render () {
        const {
            auth,
            children,
            ...props
        } = this.props;

        return React.cloneElement(
            <ApolloProvider client={this.state.client}>
                <Rehydrated>
                    {children}
                </Rehydrated>
            </ApolloProvider>,
            props
        );
    }
}
