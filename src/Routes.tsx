import React    from "react";
import Loadable from "react-loadable";

const Loading = () => <div>Loading...</div>;

export const CreateWorkPage = Loadable({
    loader: () => import("./components/page/CreateWorkPage"),
    loading: Loading,
});

export const WorkListPage = Loadable({
    loader: () => import("./components/page/WorkListPage"),
    loading: Loading,
});

export const ProfilePage = Loadable({
    loader: () => import("./components/page/ProfilePage"),
    loading: Loading,
});

export const UserListPage = Loadable({
    loader: () => import("./components/page/UserListPage"),
    loading: Loading,
});

export const UserPage = Loadable({
    loader: () => import("./components/page/UserPage"),
    loading: Loading,
});
