// import React from "react";
// import Loadable from "react-loadable";

// const Loading = () => <div>Loading...</div>;

// export const WorkPostPage = Loadable({
//     loader: () => import("src/components/pages/WorkPostPage"),
//     loading: Loading,
// });

// export const WorkListPage = Loadable({
//     loader: () => import("src/components/pages/WorkListPage"),
//     loading: Loading,
// });

// export const ProfilePage = Loadable({
//     loader: () => import("src/components/pages/ProfilePage"),
//     loading: Loading,
// });

// export const UserListPage = Loadable({
//     loader: () => import("src/components/pages/UserListPage"),
//     loading: Loading,
// });

// export const UserPage = Loadable({
//     loader: () => import("src/components/pages/UserPage"),
//     loading: Loading,
// });

export { default as NotFoundPage   } from "src/components/pages/NotFoundPage";
export { default as WorkPostPage   } from "src/components/pages/WorkPostPage";
export { default as WorkUpdatePage } from "src/components/pages/WorkUpdatePage";
export { default as WorkListPage   } from "src/components/pages/WorkListPage";
export { default as ProfilePage    } from "src/components/pages/ProfilePage";
export { default as SettingsPage   } from "src/components/pages/SettingsPage";
export { default as UserListPage   } from "src/components/pages/UserListPage";
export { default as UserPage       } from "src/components/pages/UserPage";
