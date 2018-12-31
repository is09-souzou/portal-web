import React from "react";
import * as H from "history";
import { AuthProps }                 from "src/components/wrappers/Auth";
import { NotificationListenerProps } from "src/components/wrappers/NotificationListener";
import PageHost                      from "src/components/pages/SettingsPage/PageHost";
import Header                        from "src/components/molecules/Header";

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
