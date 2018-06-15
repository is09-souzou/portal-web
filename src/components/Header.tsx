import React from "react";
import styled from "styled-components";
import * as H from "history";
import {
    AccountCircle as AccountCircleIcon,
    Menu as MenuIcon,
} from "@material-ui/icons";
import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    IconButton,
    Popover,
} from "@material-ui/core";

import { AuthProps } from "./wrapper/Auth";
import SignInDialog from "./SignInDialog";
import SignUpDialog from "./SignUpDialog";
import Link         from "./Link";
import toObjectFromURIQuery from "../api/toObjectFromURIQuery";
import { NotificationListener } from "./wrapper/NotificationListener";

interface Props extends AuthProps {
    history: H.History;
    notificationListener: NotificationListener;
    onMenuButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface State {
    userMenuAnchorEl: HTMLElement | undefined;
    userMenuOpend: boolean;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false,
        });
    }

    handleMenu = (event: React.MouseEvent<HTMLElement>): void =>
        this.setState({ userMenuAnchorEl: event.currentTarget })

    menuClose = () => this.setState({ userMenuAnchorEl: undefined });

    signInDialogOpen = () => this.props.history.push("?sign-in=true");

    signUpDialogOpen = () => this.props.history.push("?sign-up=true");

    signInDialogClose = () => this.props.history.push("?sign-in=false");

    signUpDialogClose = () =>  this.props.history.push("?sign-up=false");

    signIn = async (email: string, password: string) => {
        await this.props.auth.signIn(email, password);
        this.signInDialogClose();
    }

    render () {

        const {
            auth,
            history,
            notificationListener,
            onMenuButtonClick
        } = this.props;

        const queryParam = toObjectFromURIQuery(history.location.search);
        const signInDialogVisible = queryParam ? queryParam["sign-in"] === "true" : false;
        const signUpDialogVisible = queryParam ? queryParam["sign-up"] === "true" : false;

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
                        {!auth.token ?
                            <Button onClick={this.signInDialogOpen} >
                                Sign In
                            </Button>
                      :     <div>
                                <IconButton
                                    aria-owns={this.state.userMenuOpend ? "menu-appbar" : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                                <Popover
                                    id="menu-appbar"
                                    anchorEl={this.state.userMenuAnchorEl}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                    open={!!this.state.userMenuAnchorEl}
                                    onClose={this.menuClose}
                                >
                                    <PopoverContent>
                                        <span>Name</span>
                                        <span>Designer</span>
                                        <Link
                                            to="/profile"
                                            onClick={this.menuClose}
                                        >
                                            <Button>
                                                Profile
                                            </Button>
                                        </Link>
                                    </PopoverContent>
                                    <PopoverAction>
                                        <Button
                                            onClick={auth.signOut}
                                        >
                                            sign-out
                                        </Button>
                                    </PopoverAction>
                                </Popover>
                            </div>
                        }
                    </div>
                </StyledToolbar>
                <SignInDialog
                    open={signInDialogVisible}
                    onClose={this.signInDialogClose}
                    onSignIn={this.signIn}
                    onCreateAcountButtonClick={this.signUpDialogOpen}
                    onError={notificationListener.errorNotification}
                />
                <SignUpDialog
                    notificationListener={notificationListener}
                    open={signUpDialogVisible}
                    onClose={this.signUpDialogClose}
                    onSignUp={auth.signUp}
                />
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
`;

const StyledToolbar = styled(Toolbar)`
    && {
        display: flex;
        > :nth-child(2) {
            flex-grow: 1;
        }
    }
`;

const PopoverContent = styled.div`
    padding: 1rem;
    > :nth-child(2) {
        display: flex;
        justify-content: flex-end;
    }
`;

const PopoverAction = styled.div`
    display: flex;
`;
