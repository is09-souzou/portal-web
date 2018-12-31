import React                         from "react";
import { createMuiTheme }            from "@material-ui/core/styles";
import { MuiThemeProvider }          from "@material-ui/core";
import {
    BrowserRouter as Router,
    RouteComponentProps,
    match
}                                    from "react-router-dom";
import ComposingRoute                from "src/components/atoms/ComposingRoute";
import ComposingSwitch               from "src/components/atoms/ComposingSwitch";
import { AuthProps }                 from "src/components/wrappers/Auth";
import { MainLayoutEventProps }      from "src/components/wrappers/MainLayout";
import { NotificationListenerProps } from "src/components/wrappers/NotificationListener";
import {
    WorkPostPage,
    WorkUpdatePage,
    WorkListPage,
    ProfilePage,
    SettingsPage,
    UserPage,
    UserListPage
} from "src/Routes";
import Root from "src/Root";

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
