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
        anchorEl: undefined,
        menuOpend: false
    };

    handleChange = (_: React.MouseEvent<HTMLElement>, checked: boolean) => {
        this.setState({ auth: checked });
    }

    handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render () {

        const {
            onMenuButtonClick
        } = this.props

        return (
            <StyledAppBar position="static">
                <Toolbar>
                    <MenuIconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onMenuButtonClick}
                    >
                        <MenuIcon />
                    </MenuIconButton>
                    <Typography variant="title" color="inherit">
                        Title
                    </Typography>
                    <div>
                        <IconButton
                            aria-owns={this.state.menuOpend ? "menu-appbar" : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={this.state.menuOpend}
                            onClose={this.handleClose}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>My account</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </StyledAppBar>
        );
    }
}

const StyledAppBar = styled(AppBar)`
    && {
        width: calc(100% - 4rem);
        margin: 1rem 2rem;
        border-radius: 8px;
        color: #333;
        background-color: #f2f2f2;
    }
`;

const MenuIconButton = styled(IconButton)`
    && {
        @media (min-width: 768px) {
            display: none;
        }
    }
`
