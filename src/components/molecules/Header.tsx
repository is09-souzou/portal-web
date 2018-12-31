import { Button, Popover, Typography } from "@material-ui/core";
import AppBar, { AppBarProps } from "@material-ui/core/AppBar";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Toolbar, { ToolbarProps } from "@material-ui/core/Toolbar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import gql from "graphql-tag";
import * as H from "history";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Link from "src/components/atoms/Link";
import InitialRegistrationDialog from "src/components/organisms//InitialRegistrationDialog";
import SignInDialog from "src/components/organisms//SignInDialog";
import SignUpDialog from "src/components/organisms//SignUpDialog";
import { AuthProps } from "src/components/wrappers/Auth";
import { DrawerContext, LocaleContext } from "src/components/wrappers/MainLayout";
import { NotificationListener } from "src/components/wrappers/NotificationListener";
import styled from "styled-components";

interface Props extends AuthProps {
    history: H.History;
    notificationListener: NotificationListener;
}

interface State {
    userMenuAnchorEl: HTMLElement | undefined;
    userMenuOpend: boolean;
}

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
        }
    }
`);

export default class extends React.Component<Props, State> {

    state: State = {
        userMenuAnchorEl: undefined,
        userMenuOpend: false,
    };

    handleMenu = (event: React.MouseEvent<HTMLElement>): void =>
        this.setState({ userMenuAnchorEl: event.currentTarget })

    // TODO
    handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = (e.target as any).value;
        if (e.keyCode && e.keyCode === 13) {
            console.log(`if: ${value}`);
        }
    }

    menuClose = () => this.setState({ userMenuAnchorEl: undefined });

    signInDialogOpen = () => this.props.history.push("?sign-in=true");

    signUpDialogOpen = () => this.props.history.push("?sign-up=true");

    signInDialogClose = () => this.props.history.push("?sign-in=false");

    signUpDialogClose = () => this.props.history.push("?sign-up=false");

    initialRegistrationDialogClose = () => this.props.history.push("?initial-registration=false");

    signIn = async (email: string, password: string) => {
        await this.props.auth.signIn(email, password);
        this.signInDialogClose();
        this.menuClose();
    }

    render () {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        const queryParam = toObjectFromURIQuery(history.location.search);
        const signInDialogVisible = queryParam ? queryParam["sign-in"] === "true"
                                  :              false;
        const signUpDialogVisible = queryParam ? queryParam["sign-up"] === "true"
                                  :              false;
        const initialRegistrationDialogVisible = queryParam ? queryParam["initial-registration"] === "true"
                                                            : false;

        return (
            <StyledAppBar position="fixed">
                <LocaleContext.Consumer>
                    {({ locale }) => (
                    <StyledToolbar>
                        <DrawerContext.Consumer>
                            {({ toggleDrawer }) =>
                                <MenuIconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={toggleDrawer}
                                >
                                    <MenuIcon />
                                </MenuIconButton>
                            }
                        </DrawerContext.Consumer>
                        <Typography variant="title" color="inherit">
                            Work List
                        </Typography>
                        <div>
                            {!auth.token ?
                                <Button onClick={this.signInDialogOpen} >
                                    {locale.header.signIn}
                                </Button>
                        :     (
                                    <Query
                                        query={QueryGetUser}
                                        variables={{ id: auth.token!.payload.sub }}
                                        fetchPolicy="cache-and-network"
                                    >
                                        {({ loading, error, data }) => {
                                            if (loading) return <GraphQLProgress size={24} />;
                                            if (error) {
                                                console.error(error);
                                                return (
                                                    <Fragment>
                                                        <div>?</div>
                                                        <notificationListener.ErrorComponent error={error} />
                                                    </Fragment>
                                                );
                                            }

                                            if (!data.getUser)
                                                return <Redirect to="/profile?initial-registration=true" />;

                                            return (
                                                <Fragment>
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
                                                            <div>
                                                                <div>
                                                                    <Typography variant="caption">{locale.header.name}</Typography>
                                                                    <Typography gutterBottom>
                                                                        {data.getUser.displayName}
                                                                    </Typography>
                                                                </div>
                                                                <div>
                                                                    <Typography variant="caption">{locale.header.mailAdress}</Typography>
                                                                    <Typography gutterBottom>
                                                                        {data.getUser.email}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    to={("/users/") + auth.token!.payload.sub}
                                                                    onClick={this.menuClose}
                                                                >
                                                                    <Button>
                                                                        {locale.header.profile}
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    onClick={auth.signOut}
                                                                >
                                                                    {locale.header.signOut}
                                                                </Button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </Fragment>
                                            );
                                        }}
                                    </Query>
                                )
                            }
                        </div>
                    </StyledToolbar>
                    )}
                </LocaleContext.Consumer>
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
                <InitialRegistrationDialog
                    token={auth.token!}
                    open={initialRegistrationDialogVisible}
                    notificationListener={notificationListener}
                    onClose={this.initialRegistrationDialogClose}
                />
            </StyledAppBar>
        );
    }
}

const StyledAppBar = styled(AppBar as React.SFC<AppBarProps>)`
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

const MenuIconButton = styled(IconButton as React.SFC<IconButtonProps>)`
    && {
        @media (min-width: 768px) {
            display: none;
        }
    }
`;

const StyledToolbar = styled(Toolbar as React.SFC<ToolbarProps>)`
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
    }
`;
