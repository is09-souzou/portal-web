import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React from "react";
import {
    match,
    BrowserRouter as Router,
    RouteComponentProps
} from "react-router-dom";
import ComposingRoute from "src/components/atoms/ComposingRoute";
import ComposingSwitch from "src/components/atoms/ComposingSwitch";
import { AuthProps } from "src/components/wrappers/Auth";
import { MainLayoutEventProps } from "src/components/wrappers/MainLayout";
import { NotificationListenerProps } from "src/components/wrappers/NotificationListener";
import Root from "src/Root";
import {
    ProfilePage,
    SettingsPage,
    UserListPage,
    UserPage,
    WorkListPage,
    WorkPostPage,
    WorkUpdatePage
} from "src/Routes";

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
                        path="/works/create-work/"
                        component={WorkPostPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/works/update-work/:id"
                        component={WorkUpdatePage}
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
                        path="/settings"
                        component={SettingsPage}
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
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiDialog: {
            paper: {
                border: 0,
                borderRadius: 8,
                color: "white",
            },
        },
    },
    palette: {
        primary: {
            contrastText: "#fff",
            dark: "#c56200",
            light: "#ffc246",
            main: "#ff9100",
        },
    }
});

export interface PageComponentProps<T> extends RouteComponentProps<T>, AuthProps, NotificationListenerProps, MainLayoutEventProps {
    computedMatch?: match<T>;
}
