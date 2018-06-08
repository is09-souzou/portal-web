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
import AccountRegistrationPage from "./components/page/AccountRegistrationPage";
import CreateWorkPage from "./components/page/CreateWorkPage";
import UserInformationPage from "./components/page/UserInformationPage";
import UserListPage   from "./components/page/UserListPage";
import Auth           from "./components/wrapper/Auth";
import AppSyncClient  from "./components/wrapper/AppSyncClient";
import ErrorListener  from "./components/wrapper/ErrorListener";

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
        <ErrorListener>
            <Root>
                <ComposingSwitch>
                    <ComposingRoute path="/"          component={WorkPage} exact={true} />
                    <ComposingRoute path="/works"     component={WorkPage} exact={true} />
                    <ComposingRoute path="/works/new" component={WorkPage} exact={true} />
                    <ComposingRoute path="/works/create-work" component={CreateWorkPage} exact={true} />
                    <ComposingRoute path="/users" component={UserListPage} exact={true} />
                    <ComposingRoute path="/users/user-information" component={UserInformationPage} exact={true} />
                    <ComposingRoute path="/account-registration" component={AccountRegistrationPage} exact={true} />
                </ComposingSwitch>
            </Root>
        </ErrorListener>
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
