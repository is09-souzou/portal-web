import React from "react";
import styled from "styled-components";
import {
    Drawer,
    Button
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import Header    from "./Header";
import Navigator from "./Navigator";
import Link      from "./Link";
import { PageComponentProps } from "../App";

interface State {
    drawerOpend: boolean;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            drawerOpend: false
        });
    }

    toggleDrawer = () => {
        this.setState({ drawerOpend: !this.state.drawerOpend });
    }

    render() {

        const {
            auth,
            notificationListener,
            children,
            history,
            ...props
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
                        {React.cloneElement(
                            children as React.ReactElement<PageComponentProps<{}>>,
                            {
                                auth,
                                notificationListener,
                                history,
                                ...props
                            }
                        )}
                    </Main>
                    <Link
                        to="/works/create-work"
                    >
                      <FAB variant="fab" color="primary" aria-label="add" >
                          <AddIcon />
                      </FAB>
                    </Link>
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

const FAB = styled(Button)`
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
