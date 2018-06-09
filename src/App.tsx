import React from "react";
import {
    BrowserRouter,
    withRouter,
    RouteComponentProps,
    match
} from "react-router-dom";
import { createMuiTheme }   from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";
import Auth, { AuthProps } from "./components/wrapper/Auth";
import AppSyncClient  from "./components/wrapper/AppSyncClient";
import ErrorListener  from "./components/wrapper/ErrorListener";

import WorkPage                from "./components/page/WorkPage";
import AccountRegistrationPage from "./components/page/AccountRegistrationPage";
import CreateWorkPage          from "./components/page/CreateWorkPage";
import UserInformationPage     from "./components/page/UserInformationPage";

import MainLayout      from "./components/MainLayout";
import ComposingRoute  from "./components/ComposingRoute";
import ComposingSwitch from "./components/ComposingSwitch";
// TODO test
import UserListPage   from "./components/page/UserListPage";
import UserPage       from "./components/page/UserPage";

const Root = withRouter((props: RouteComponentProps<any>) => (
    <Auth
        // tslint:disable-next-line:jsx-no-lambda
        render={(authProps: AuthProps) => (
            <AppSyncClient
                {...authProps}
            >
                <MuiThemeProvider theme={theme}>
                    <MainLayout
                        {...authProps}
                        {...props}
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
                    <ComposingRoute path="/users/:id" component={UserPage} exact={true} />
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

export interface PageComponentProps<T> extends RouteComponentProps<T>, AuthProps {
    computedMatch?: match<T>;
    errorListener?: any;
}
