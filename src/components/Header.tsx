import React from "react";
import styled from "styled-components";
import {
    AccountCircle as AccountCircleIcon,
    Menu as MenuIcon,
 } from "@material-ui/icons";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem
} from "@material-ui/core";

export default class extends React.Component<{onMenuButtonClick: (event: React.MouseEvent<HTMLElement>) => void}> {
    state = {
        userMenuAnchorEl: undefined,
        userMenuOpend: false
    };

    handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
        this.setState({ userMenuAnchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ userMenuAnchorEl: null });
    }

    render () {

        const {
            onMenuButtonClick
        } = this.props

        return (
            <StyledAppBar position="fixed">
                <StyledToolbar>
                    <MenuIconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onMenuButtonClick}
                    >
                        <MenuIcon />
                    </MenuIconButton>
                    <Typography variant="title" color="inherit">
                        Work List
                    </Typography>
                    <div>
                        <IconButton
                            aria-owns={this.state.userMenuOpend ? "menu-appbar" : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={this.state.userMenuAnchorEl}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={!!this.state.userMenuAnchorEl}
                            onClose={this.handleClose}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>My account</MenuItem>
                        </Menu>
                    </div>
                </StyledToolbar>
            </StyledAppBar>
        );
    }
}

const StyledAppBar = styled(AppBar)`
    && {
        width: calc(100% - 15rem - 6rem);
        margin: 1rem 3rem 0 2rem;
        border-radius: 8px;
        color: #333;
        background-color: white;
        @media (max-width: 767px) {
            width: calc(100% - 6rem);
        }
    }
`;

const MenuIconButton = styled(IconButton)`
    && {
        @media (min-width: 768px) {
            display: none;
        }
    }
`

const StyledToolbar = styled(Toolbar)`
    && {
        display: flex;
        > :nth-child(2) {
            flex-grow: 1;
        }
    }
`
