import React, { SFC } from "react";
import Header from "./Header";
import styled from "styled-components";
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@material-ui/core";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import StarIcon from "@material-ui/icons/Star";
import SendIcon from "@material-ui/icons/Send";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import ReportIcon from "@material-ui/icons/Report";

export default class extends React.Component {

    state = {
        drawerOpend: false
    }

    toggleDrawer = () => {
        this.setState({ drawerOpend: !this.state.drawerOpend });
    };

    render() {

        return (
            <Host>
                <div>
                    <Drawer
                        variant="temporary"
                        anchor={"left"}
                        open={this.state.drawerOpend}
                        onClose={this.toggleDrawer}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {nav}
                    </Drawer>
                </div>
                <div>
                    <Drawer
                        variant="permanent"
                        open
                    >
                        {nav}
                    </Drawer>
                </div>
                <Content>
                    <Header
                        onMenuButtonClick={this.toggleDrawer}
                    />
                    <main>
                        {this.props.children}
                    </main>
                </Content>
            </Host>
        );
    }
}

const Host = styled.div`
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
    left: 15rem;
    @media (max-width: 767px) {
        width: 100%;
        left: 0rem;
    }
`;


const Title = styled(Typography)`
    padding-top: 2.5rem;
    padding-bottom: .5rem;
    text-align: center;
`

const nav = (
    <div
        style={{
            width: "15rem"
        }}
    >
        <Title variant="headline">
            Portal
        </Title>
        <Divider />
        <List>
            <ListItem button>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <StarIcon />
                </ListItemIcon>
                <ListItemText primary="Starred" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Send mail" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button>
                <ListItemIcon>
                    <MailIcon />
                </ListItemIcon>
                <ListItemText primary="All mail" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Trash" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ReportIcon />
                </ListItemIcon>
                <ListItemText primary="Spam" />
            </ListItem>
        </List>
    </div>
)
