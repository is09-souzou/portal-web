import React from "react";
import {
    BrowserRouter,
    Route,
    Switch
} from "react-router-dom";
import appSyncConfig from "./appSyncConfig";
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/141
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/48
declare const require: any;
const { Rehydrated }       = require("aws-appsync-react");
const { AWSAppSyncClient } = require("aws-appsync");
import { ApolloProvider }   from "react-apollo";
import { createMuiTheme }   from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";

import MainLayout from "./components/MainLayout";
import WorkPage   from "./components/WorkPage";

export default () => (
    <BrowserRouter>
        <ApolloProvider client={client}>
            <MuiThemeProvider theme={theme}>
                <Rehydrated>
                    <MainLayout>
                        <ComposingSwitch>
                            <ComposingRoute path="/"      component={WorkPage} exact={true} />
                            <ComposingRoute path="/works" component={WorkPage} />
                        </ComposingSwitch>
                    </MainLayout>
                </Rehydrated>
            </MuiThemeProvider>
        </ApolloProvider>
    </BrowserRouter>
);

const client = new AWSAppSyncClient({
    url: appSyncConfig.graphqlEndpoint,
    region: appSyncConfig.region,
    auth: {
        type: appSyncConfig.authenticationType,
        apiKey: appSyncConfig.apiKey,
    }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#ffc246",
            main: "#ff9100",
            dark: "#c56200",
            contrastText: "#fff",
        },
    },
});

const ComposingRoute = ({
    component,
    Component = component,
    path,
    ...props
}: any) => (
    <Route
        path={path}
        // tslint:disable-next-line:jsx-no-lambda
        render={x => <Component {...x} {...props} />}
    />
);

// tslint:disable-next-line:jsx-no-multiline-js
const ComposingSwitch = ({
    children,
    ...props
}: any) => (
    <Switch>
        {React.Children.toArray(children).map(
            (x: any) => React.cloneElement(
                x,
                {
                    ...props,
                    ...x.props
                }
            )
        )}
    </Switch>
);
