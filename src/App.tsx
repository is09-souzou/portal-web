import React from "react";
import {
    BrowserRouter,
    Route,
    Switch,
    withRouter
} from "react-router-dom";
import { createMuiTheme }   from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";

import MainLayout     from "./components/MainLayout";
import WorkPage       from "./components/page/WorkPage";
// TODO test
import UserListPage   from "./components/page/UserListPage";
import CreateWorkPage from "./components/page/CreateWorkPage";
import Auth           from "./components/wrapper/Auth";
import AppSyncClient  from "./components/wrapper/AppSyncClient";

const Root = withRouter(props => (
    <Auth
        // tslint:disable-next-line:jsx-no-lambda
        render={(authProps: any) => (
            <AppSyncClient
                {...authProps}
            >
                <MuiThemeProvider theme={theme}>
                    <MainLayout
                        {...props}
                        {...authProps}
                    />
                </MuiThemeProvider>
            </AppSyncClient>
        )}
    />
));

export default () => (
    <BrowserRouter>
        <Root>
            <ComposingSwitch>
                <ComposingRoute path="/"          component={WorkPage} exact={true} />
                <ComposingRoute path="/works"     component={WorkPage} exact={true} />
                <ComposingRoute path="/works/new" component={WorkPage} exact={true} />
                <ComposingRoute path="/works/create-work" component={CreateWorkPage} exact={true} />
                <ComposingRoute path="/users" component={UserListPage} exact={true} />
            </ComposingSwitch>
        </Root>
    </BrowserRouter>
);

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
