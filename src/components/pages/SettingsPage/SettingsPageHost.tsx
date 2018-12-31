import * as H from "history";
import React from "react";
import Header from "src/components/molecules/Header";
import PageHost from "src/components/pages/SettingsPage/PageHost";
import { AuthProps } from "src/components/wrappers/Auth";
import { NotificationListenerProps } from "src/components/wrappers/NotificationListener";

export default (
    {
        auth,
        history,
        notificationListener,
        children,
        ...props
    }: { children: any, history: H.History } & AuthProps & NotificationListenerProps
) => (
    <PageHost {...props}>
        <Header
            auth={auth}
            history={history}
            notificationListener={notificationListener}
        />
        <div>
            {children}
        </div>
    </PageHost>
);
