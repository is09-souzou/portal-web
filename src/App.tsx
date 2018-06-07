import React from "react";
import {
    BrowserRouter,
    Route,
    Switch,
    withRouter
} from "react-router-dom";
import config from "./config";
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/141
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/48
declare const require: any;
const { Rehydrated }       = require("aws-appsync-react");
const { AWSAppSyncClient } = require("aws-appsync");
import { ApolloProvider }   from "react-apollo";
import { createMuiTheme }   from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";

import MainLayout     from "./components/MainLayout";
import WorkPage       from "./components/WorkPage";
import CreateWorkPage from "./components/CreateWorkPage";
import Auth           from "./components/wrapper/Auth";

const Root = withRouter(props => (
    <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
            <Rehydrated>
                <Auth>
                    <MainLayout
                        auth={undefined}
                        {...props}
                    />
                </Auth>
            </Rehydrated>
        </MuiThemeProvider>
    </ApolloProvider>
));

export default () => (
    <BrowserRouter>
        <Root>
            <ComposingSwitch>
                <ComposingRoute path="/"          component={WorkPage} exact={true} />
                <ComposingRoute path="/works"     component={WorkPage} exact={true} />
                <ComposingRoute path="/works/new" component={WorkPage} exact={true} />
                <ComposingRoute path="/works/create-work" component={CreateWorkPage} exact={true} />
            </ComposingSwitch>
        </Root>
    </BrowserRouter>
);

const client = new AWSAppSyncClient({
    url: config.appSync.graphqlEndpoint,
    region: config.appSync.region,
    auth: {
        type: config.appSync.authenticationType,
        apiKey: config.appSync.apiKey,
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
    overrides: {
        MuiDialog: {
            paper: {
                borderRadius: 8,
                border: 0,
                color: "white",
            },
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
