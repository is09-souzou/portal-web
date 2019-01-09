import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
    <BrowserRouter
    >
        <Root>
            <Switch>
                <Route
                    path="/"
                    component={WorkListPage}
                    exact={true}
                />
                <Route
                    path="/works/create-work/"
                    component={WorkPostPage}
                    exact={true}
                />
                <Route
                    path="/works/update-work/:id"
                    component={WorkUpdatePage}
                    exact={true}
                />
                <Route
                    path="/works"
                    component={WorkListPage}
                />
                <Route
                    path="/users"
                    component={UserListPage}
                    exact={true}
                />
                <Route
                    path="/users/:id"
                    component={UserPage}
                    exact={true}
                />
                <Route
                    path="/settings"
                    component={SettingsPage}
                    exact={true}
                />
                <Route
                    path="/profile"
                    component={ProfilePage}
                    exact={true}
                />
            </Switch>
        </Root>
    </BrowserRouter>
);
