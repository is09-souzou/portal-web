import { AWSAppSyncClient } from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";
import React, { useContext, useState } from "react";
import { ApolloProvider } from "react-apollo";
import config from "src/config";
import AppSyncClientContext from "src/contexts/AppSyncClientContext";
import AuthContext from "src/contexts/AuthContext";

export default (
    {
        children
    }: React.Props<{}>
) => {
    const authContext = useContext(AuthContext);

    const [client, setClient] = useState(
        new AWSAppSyncClient({
            url: authContext.token ? config.appSync.graphqlEndpoint : config.publicAppSync.graphqlEndpoint,
            region: config.appSync.region,
            auth: {
                type: authContext.token ? config.appSync.authenticationType : config.publicAppSync.authenticationType,
                jwtToken: () => authContext.token ? authContext.token.jwtToken : "",
                apiKey: config.publicAppSync.apiKey
            }
        })
    );
    authContext.subscribeToken((token) => {
        setClient(
            new AWSAppSyncClient({
                url: token ? config.appSync.graphqlEndpoint : config.publicAppSync.graphqlEndpoint,
                region: config.appSync.region,
                auth: {
                    type: token ? config.appSync.authenticationType : config.publicAppSync.authenticationType,
                    jwtToken: () => token ? token.jwtToken : "",
                    apiKey: config.publicAppSync.apiKey
                }
            })
        );
    });

    return (
        <ApolloProvider client={client as any}>
            <Rehydrated>
                <AppSyncClientContext.Provider
                    value={{ client }}
                >
                    {children}
                </AppSyncClientContext.Provider>
            </Rehydrated>
        </ApolloProvider>
    );
};
