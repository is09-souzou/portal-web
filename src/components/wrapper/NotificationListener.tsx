import React, { ReactNode } from "react";
import NotificationComponent from "../Notification";

export type Notification = (type: "info" | "error", message: string) => void;
export type ErrorNotification = (error: Error) => void;
export type NotificationListener = {
    ErrorComponent   : any,
    notification     : Notification,
    errorNotification: ErrorNotification
};

export interface NotificationListenerProps {
    notificationListener: NotificationListener;
}

interface Props {
    render: (notificationListener: NotificationListenerProps) => ReactNode;
}

interface State {
    notifications: {
        type: "info" | "error",
        message: string,
        key: number
    }[];
}

export default class extends React.Component<Props, State> {

    onCloseByKey = (key: number) => () => this.setState({
        notifications: this.state.notifications.filter(y => key !== y.key)
    })

    componentWillMount() {
        this.setState({
            notifications: []
        });
    }

    render() {

        const {
            children,
            render,
            ...props
        } = this.props;

        return (
            <div>
                {render({
                    notificationListener: {
                        ErrorComponent: (props: any) => <NotificationComponent type="error" {...props}/>,
                        notification: (type, message) => {
                            this.setState({
                                notifications: this.state.notifications.concat({
                                    type,
                                    message,
                                    key  : Date.now()
                                })
                            });
                        },
                        errorNotification: (error: Error) => {
                            this.setState({
                                notifications: this.state.notifications.concat({
                                    type: "error",
                                    message: error.message,
                                    key  : Date.now()
                                })
                            });
                        },
                    },
                    ...props
                })}
                {this.state.notifications.map(x =>
                    <NotificationComponent
                        type={x.type}
                        key={x.key}
                        message={x.message}
                        open={true}
                        onClose={this.onCloseByKey(x.key)}
                    />
                )}
            </div>
        );
    }
}
