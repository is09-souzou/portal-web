// import React    from "react";
// import Loadable from "react-loadable";

// const Loading = () => <div>Loading...</div>;

// export const WorkPostPage = Loadable({
//     loader: () => import("./components/page/WorkPostPage"),
//     loading: Loading,
// });

// export const WorkListPage = Loadable({
//     loader: () => import("./components/page/WorkListPage"),
//     loading: Loading,
// });

// export const ProfilePage = Loadable({
//     loader: () => import("./components/page/ProfilePage"),
//     loading: Loading,
// });

// export const UserListPage = Loadable({
//     loader: () => import("./components/page/UserListPage"),
//     loading: Loading,
// });

// export const UserPage = Loadable({
//     loader: () => import("./components/page/UserPage"),
//     loading: Loading,
// });

export { default as WorkPostPage } from "./components/page/WorkPostPage";
export { default as WorkListPage } from "./components/page/WorkListPage";
export { default as ProfilePage  } from "./components/page/ProfilePage";
export { default as SettingsPage  } from "./components/page/SettingsPage";
export { default as UserListPage } from "./components/page/UserListPage";
export { default as UserPage     } from "./components/page/UserPage";
