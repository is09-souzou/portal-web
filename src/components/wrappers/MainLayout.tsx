import { Drawer } from "@material-ui/core";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Navigator from "src/components/molecules/Navigator";
import { NotificationListenerProps } from "src/components/wrappers/NotificationListener";
import Locale, { location } from "src/localization/locale";
import styled from "styled-components";

interface State {
    drawerOpend: boolean;
    fabIsVisible: boolean;
    fabClickSubscribers: { key: number; fn: (e: any) => void; }[];
    locale: location;
}

interface Props extends RouteComponentProps<{}>, NotificationListenerProps {
    render: (mainLayoutEventProps: MainLayoutEventProps) => React.ReactNode;
}

export interface MainLayoutEventProps {
}

interface DrawerContextModel {
    toggleDrawer: () => void;
}

export const DrawerContext = React.createContext<DrawerContextModel>({
    toggleDrawer: () => undefined
});

export const LocaleContext = React.createContext({
    locale: Locale.us,
    handleLocale: () => {}
});

export default class extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const language = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language;
        this.state = {
            drawerOpend: false,
            fabIsVisible: true,
            fabClickSubscribers: [],
            locale: language === "ja" || language === "ja-JP" ? "jp" : "us"
        };
    }

    toggleDrawer = () => this.setState({ drawerOpend: !this.state.drawerOpend });
    handleLocale = () => this.setState({ locale: this.state.locale === "us" ? "jp" : "us" });

    render() {

        const {
            history,
            notificationListener,
            render
        } = this.props;

        return (
            <Host>
                <LocaleContext.Provider
                    value={{
                        locale: Locale[this.state.locale],
                        handleLocale: this.handleLocale
                    }}
                >
                    <div>
                        <Drawer
                            variant="temporary"
                            anchor={"left"}
                            open={this.state.drawerOpend}
                            onClose={this.toggleDrawer}
                            ModalProps={{ keepMounted: true }}
                        >
                            <Navigator
                                history={history}
                                notificationListener={notificationListener}
                            />
                        </Drawer>
                    </div>
                    <div>
                        <Drawer
                            variant="permanent"
                            open
                        >
                            <Navigator
                                history={history}
                                notificationListener={notificationListener}
                            />
                        </Drawer>
                    </div>
                    <Content>
                        <DrawerContext.Provider
                            value={{
                                toggleDrawer: this.toggleDrawer
                            }}
                        >
                            <Main>
                                {render({})}
                            </Main>
                        </DrawerContext.Provider>
                    </Content>
                </LocaleContext.Provider>
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
`;

const Main = styled.main`
    min-height: calc(100vh - 7rem);
    margin-top: 7rem;
`;
