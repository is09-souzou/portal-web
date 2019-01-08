import { Button, Popover, Typography } from "@material-ui/core";
import AppBar, { AppBarProps } from "@material-ui/core/AppBar";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Toolbar, { ToolbarProps } from "@material-ui/core/Toolbar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import gql from "graphql-tag";
import React, { useContext, useState, Fragment } from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Link from "src/components/atoms/Link";
import InitialRegistrationDialog from "src/components/organisms/InitialRegistrationDialog";
import SignInDialog from "src/components/organisms/SignInDialog";
import SignUpDialog from "src/components/organisms/SignUpDialog";
import AuthContext from "src/contexts/AuthContext";
import DrawerContext from "src/contexts/DrawerContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import styled from "styled-components";

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
        }
    }
`);

export default (props: React.Props<{}>) => {
    const [userMenuVisibled] = useState<boolean>(false);
    const [userMenuAnchorElement, setUserMenuAnchorElement] = useState<HTMLElement | undefined>(undefined);

    const auth = useContext(AuthContext);
    const drawer = useContext(DrawerContext);
    const localization = useContext(LocalizationContext);
    const routerHistory = useContext(RouterHistoryContext);
    const notification = useContext(NotificationContext);

    const handleMenu = (e: React.MouseEvent<HTMLElement>): void =>
        setUserMenuAnchorElement(e.currentTarget);

    // const handleSearch = (e: React.KeyboardEvent) => {
    //     const value = (e.target as any).value;
    //     if (e.keyCode && e.keyCode === 13) {
    //         console.log(`if: ${value}`);
    //     }
    // };

    const closeMenu = () => setUserMenuAnchorElement(undefined);
    const openSignInDialog = () => routerHistory.history.push("?sign-in=true");
    const openSignUpDialog = () => routerHistory.history.push("?sign-up=true");
    const closeSignInDialog = () => routerHistory.history.push("?sign-in=false");
    const closeSignUpDialog = () => routerHistory.history.push("?sign-up=false");
    const closeInitialRegistrationDialog = () => routerHistory.history.push("?initial-registration=false");
    const signIn = async (email: string, password: string) => {
        await auth.signIn(email, password);
        closeSignInDialog();
        closeMenu();
    };

    const queryParam = toObjectFromURIQuery(routerHistory.history.location.search);
    const signInDialogVisible = queryParam ? queryParam["sign-in"] === "true"
                              :              false;
    const signUpDialogVisible = queryParam ? queryParam["sign-up"] === "true"
                              :              false;
    const initialRegistrationDialogVisible = queryParam ? queryParam["initial-registration"] === "true"
                                           :               false;

    return (
        <StyledAppBar
            position="fixed"
            {...props}
        >
                <StyledToolbar>
                    <MenuIconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={drawer.toggleDrawer}
                    >
                        <MenuIcon/>
                    </MenuIconButton>
                    <Typography variant="h6" color="inherit">
                        Work List
                    </Typography>
                    <div>
                        {!auth.token ?
                            <Button onClick={openSignInDialog} >
                                {localization.locationText.header.signIn}
                            </Button>
                    :     (
                                <Query
                                    query={QueryGetUser}
                                    variables={{ id: auth.token!.payload.sub }}
                                    fetchPolicy="cache-and-network"
                                >
                                    {({ loading, error, data }) => {
                                        if (loading) return <GraphQLProgress size={24}/>;
                                        if (error) {
                                            console.error(error);
                                            return (
                                                <Fragment>
                                                    <div>?</div>
                                                    <notification.ErrorComponent error={error}/>
                                                </Fragment>
                                            );
                                        }

                                        if (!data.getUser)
                                            return <Redirect to="/profile?initial-registration=true"/>;

                                        return (
                                            <Fragment>
                                                <IconButton
                                                    aria-owns={userMenuVisibled ? "menu-appbar" : undefined}
                                                    aria-haspopup="true"
                                                    onClick={handleMenu}
                                                    color="inherit"
                                                >
                                                    <AccountCircleIcon/>
                                                </IconButton>
                                                <Popover
                                                    id="menu-appbar"
                                                    anchorEl={userMenuAnchorElement}
                                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                                    open={!!userMenuAnchorElement}
                                                    onClose={closeMenu}
                                                >
                                                    <PopoverContent>
                                                        <div>
                                                            <div>
                                                                <Typography variant="caption">{localization.locationText.header.name}</Typography>
                                                                <Typography gutterBottom>
                                                                    {data.getUser.displayName}
                                                                </Typography>
                                                            </div>
                                                            <div>
                                                                <Typography variant="caption">{localization.locationText.header.mailAdress}</Typography>
                                                                <Typography gutterBottom>
                                                                    {data.getUser.email}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Link
                                                                to={("/users/") + auth.token!.payload.sub}
                                                                onClick={closeMenu}
                                                            >
                                                                <Button>
                                                                    {localization.locationText.header.profile}
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                onClick={auth.signOut}
                                                            >
                                                                {localization.locationText.header.signOut}
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
            <SignInDialog
                open={signInDialogVisible}
                onClose={closeSignUpDialog}
                onSignIn={signIn}
                onCreateAcountButtonClick={openSignUpDialog}
            />
            <SignUpDialog
                open={signUpDialogVisible}
                onClose={closeSignInDialog}
                onSignUp={auth.signUp}
            />
            <InitialRegistrationDialog
                open={initialRegistrationDialogVisible}
                onClose={closeInitialRegistrationDialog}
            />
        </StyledAppBar>
    );
};

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
