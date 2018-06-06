import React, { ReactElement } from "react";
import Header from "./Header";
import styled from "styled-components";
import {
    Drawer,
    Button
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Navigator from "./Navigator";

export default class extends React.Component<any> {

    state = {
        drawerOpend: false
    };

    toggleDrawer = () => {
        this.setState({ drawerOpend: !this.state.drawerOpend });
    }

    render() {
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
                            histroy={this.props.history}
                        />
                    </Drawer>
                </div>
                <div>
                    <Drawer
                        variant="permanent"
                        open
                    >
                        <Navigator
                            histroy={this.props.history}
                        />
                    </Drawer>
                </div>
                <Content>
                    <Header
                        onMenuButtonClick={this.toggleDrawer}
                    />
                    <main>
                        {React.cloneElement(
                            this.props.children as ReactElement<any>,
                            {
                                ...this.props
                            }
                        )}
                    </main>
                    <FAB variant="fab" color="primary" aria-label="add" >
                        <AddIcon />
                    </FAB>
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
