import React from "react";
import styled from "styled-components";
import {
    Drawer,
    Button
} from "@material-ui/core";
import Header    from "./../Header";
import Navigator from "./../Navigator";
import { RouteComponentProps } from "react-router-dom";
import { AuthProps } from "./../wrapper/Auth";
import { NotificationListenerProps } from "./../wrapper/NotificationListener";

interface State {
    drawerOpend: boolean;
    fabIsVisible: boolean;
    fabClickSubscribers: { key: number; fn: (e: any) => void; }[];
    fabIcon: React.ReactNode;
}

interface Props extends RouteComponentProps<{}>, AuthProps, NotificationListenerProps {
    render: (mainLayoutEventProps: MainLayoutEventProps) => React.ReactNode;
}

interface FabApi {
    visible: boolean;
    toHide: () => void;
    toView: () => void;
    toggleVisibility: () => void;
    setIcon: (n: React.ReactNode) => void;
    subscribeClick: (fn: (e: any) => void) => () => void;
}

export interface MainLayoutEventProps {
    fabApi: FabApi;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            drawerOpend: false,
            fabIsVisible: true,
            fabClickSubscribers: []
        });
    }

    onFabClick = (e: any) => {
        for (const x of this.state.fabClickSubscribers)
            x.fn(e);
    }

    toggleDrawer = () => {
        this.setState({ drawerOpend: !this.state.drawerOpend });
    }

    render() {

        const {
            auth,
            notificationListener,
            history,
            render
        } = this.props;

        return (
            <Host>
                <div>
                    <Drawer
                        variant="temporary"
                        anchor={"left"}
                        open={this.state.drawerOpend}
                        onClose={this.toggleDrawer}
                        ModalProps={{ keepMounted: true }}
                    >
                        <Navigator
                            histroy={history}
                        />
                    </Drawer>
                </div>
                <div>
                    <Drawer
                        variant="permanent"
                        open
                    >
                        <Navigator
                            histroy={history}
                        />
                    </Drawer>
                </div>
                <Content>
                    <Header
                        onMenuButtonClick={this.toggleDrawer}
                        auth={auth}
                        history={history}
                        notificationListener={notificationListener}
                    />
                    <Main>
                        {render({
                            fabApi: {
                                visible: this.state.fabIsVisible,
                                toHide: () => this.setState({ fabIsVisible: false }),
                                toView: () => this.setState({ fabIsVisible: true }),
                                toggleVisibility: () => this.setState({ fabIsVisible: !this.state.fabIsVisible }),
                                setIcon: (n: React.ReactNode) => this.setState({ fabIcon: n }),
                                subscribeClick: (fn: (e: any) => void) => {
                                    const key = Math.random();

                                    this.setState({
                                        fabClickSubscribers: this.state.fabClickSubscribers.concat({
                                            key,
                                            fn
                                        })
                                    });
                                    return () => this.setState({
                                        fabClickSubscribers: this.state.fabClickSubscribers.filter(x =>
                                            x.key !== key
                                        )
                                    });
                                }
                            },
                        })}
                    </Main>
                    <Fab
                        style={!this.state.fabIsVisible ? { display: "none" } : {}}
                        variant="fab"
                        color="primary"
                        aria-label="add"
                        onClick={this.onFabClick}
                    >
                        {this.state.fabIcon || ""}
                    </Fab>
                </Content>
            </Host>
        );
    }
}

const Host = styled.div`
    background-color: #fafbfd;
    > :nth-child(1) {
        display: none;
    }
    > :nth-child(2) {
        display: flex;
    }

    @media (max-width: 767px) {
        > :nth-child(1) {
            display: flex;
        }
        > :nth-child(2) {
            display: none;
        }
    }
`;

const Content = styled.div`
    position: relative;
    width: calc(100% - 15rem);
    margin-left: 15rem;
    @media (max-width: 767px) {
        width: 100%;
        margin-left: 0rem;
    }
    > :nth-child(2) {
        margin-top: 7rem;
    }
`;

const Fab = styled(Button)`
    && {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 2rem;
    }
`;

const Main = styled.main`
    min-height: calc(100vh - 7rem);
    height: 100%;
`;
