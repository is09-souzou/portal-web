import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Root from "src/Root";
import {
    NotFoundPage,
    ProfilePage,
    SettingsPage,
    UserListPage,
    UserPage,
    WorkListPage,
    WorkPostPage,
    WorkUpdatePage
} from "src/Routes";

export default () => (
    <BrowserRouter>
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
                    // https://github.com/ReactTraining/react-router/issues/6056
                    component={() => <UserListPage/>}
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
                <Route component={NotFoundPage}/>
            </Switch>
        </Root>
    </BrowserRouter>
);
