import React from "react";
import AppSyncClient from "src/components/wrappers/AppSyncClient";
import Auth from "src/components/wrappers/Auth";
import MainLayout from "src/components/wrappers/MainLayout";
import Notification from "src/components/wrappers/Notification";
import RouterHistory from "src/components/wrappers/RouterHistory";

// Do not change of componet order
export default (
    {
        children
    }: React.Props<{}>
) => (
    <RouterHistory>
        <Notification>
            <Auth>
                <AppSyncClient>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </AppSyncClient>
            </Auth>
        </Notification>
    </RouterHistory>
);
