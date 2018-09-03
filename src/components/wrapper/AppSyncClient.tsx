import React, { ReactChild } from "react";
import { Rehydrated }       from "aws-appsync-react";
import { AUTH_TYPE }        from "aws-appsync/lib/link/auth-link";
import { AWSAppSyncClient } from "aws-appsync";
import { ApolloProvider }   from "react-apollo";
import config               from "../../config";
import { AuthProps }        from "./Auth";

interface Props extends AuthProps {
    children: ReactChild;
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
                    jwtToken: () => this.props.auth.token ? this.props.auth.token.jwtToken : ""
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
