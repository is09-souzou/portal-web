import React from "react";
import {
    withRouter,
    RouteComponentProps,
} from "react-router-dom";
import Auth, { AuthProps }                                  from "src/components/wrappers/Auth";
import AppSyncClient                                        from "src/components/wrappers/AppSyncClient";
import MainLayout, { MainLayoutEventProps }                 from "src/components/wrappers/MainLayout";
import NotificationListener, { NotificationListenerProps }  from "src/components/wrappers/NotificationListener";
import { PageComponentProps }                               from "src/App";

// tslint:disable-next-line:max-line-length
export default withRouter<RouteComponentProps<any> & { children: React.ReactElement<any> }>((props: RouteComponentProps<any> & { children: React.ReactElement<PageComponentProps<any>> }) => (
    <NotificationListener
        // tslint:disable-next-line:jsx-no-lambda
        render={(notificationListener: NotificationListenerProps) =>
            <Auth
                // tslint:disable-next-line:jsx-no-lambda
                render={(authProps: AuthProps) => (
                    <AppSyncClient
                        {...authProps}
                    >
                        <MainLayout
                            render={(mainLayoutEventProps: MainLayoutEventProps) => React.cloneElement<PageComponentProps<any>>(
                                props.children,
                                {
                                    ...authProps,
                                    ...mainLayoutEventProps,
                                    ...notificationListener,
                                    ...(
                                        Object.entries(props)
                                            .filter(x => x[0] !== "children")
                                            .reduce((prev, next) => Object.assign(prev, { [next[0]]: next[1] }), {})
                                    )
                                }
                            )}
                            {...notificationListener}
                            {...props}
                        />
                    </AppSyncClient>
                )}
            />
        }
    />
));
