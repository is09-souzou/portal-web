import React from "react";
import { createMuiTheme }   from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";
import {
    BrowserRouter as Router,
    RouteComponentProps,
    match
} from "react-router-dom";
import ComposingRoute                from "./components/ComposingRoute";
import ComposingSwitch               from "./components/ComposingSwitch";
import { AuthProps }                 from "./components/wrapper/Auth";
import { MainLayoutEventProps }      from "./components/wrapper/MainLayout";
import { NotificationListenerProps } from "./components/wrapper/NotificationListener";
import {
    WorkPostPage,
    WorkListPage,
    ProfilePage,
    SettingPage,
    UserPage,
    UserListPage
} from "./Routes";
import Root from "./Root";

export default () => (
    <MuiThemeProvider theme={theme}>
        <Router>
            <Root
                key="root"
            >
                <ComposingSwitch>
                    <ComposingRoute
                        path="/"
                        component={WorkListPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/works/create-work"
                        component={WorkPostPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/works"
                        component={WorkListPage}
                    />
                    <ComposingRoute
                        path="/users"
                        component={UserListPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/users/:id"
                        component={UserPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/setting"
                        component={SettingPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/profile"
                        component={ProfilePage}
                        exact={true}
                    />
                </ComposingSwitch>
            </Root>
        </Router>
    </MuiThemeProvider>
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

export interface PageComponentProps<T> extends RouteComponentProps<T>, AuthProps, NotificationListenerProps, MainLayoutEventProps {
    computedMatch?: match<T>;
}
