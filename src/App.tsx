import React, { SFC }                     from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import appSyncConfig                      from "./appSyncConfig";
import gql                                from "graphql-tag";
import MainLayout                         from "./components/MainLayout";

// https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/141
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/48
declare const require: any;
const { Rehydrated }       = require("aws-appsync-react");
const { AWSAppSyncClient } = require("aws-appsync");
import { ApolloProvider }       from "react-apollo";

const query = gql(`
mutation($name: String!) {
    createEvent(
        name: $name
    ) {
        name
    }
}`);

const Test = () => <div/>;

const App = () => (
    <Router>
        <MainLayout>
            <Route exact={true} path="/" component={Test} />
            <Route path="/event/:id" component={Test} />
            <Route path="/newEvent" component={Test} />
        </MainLayout>
    </Router>
);

const client = new AWSAppSyncClient({
    url: appSyncConfig.graphqlEndpoint,
    region: appSyncConfig.region,
    auth: {
        type: appSyncConfig.authenticationType,
        apiKey: appSyncConfig.apiKey,
    }
});

export default () => (
    <ApolloProvider client={client}>
        <Rehydrated>
            <App />
        </Rehydrated>
    </ApolloProvider>
);
