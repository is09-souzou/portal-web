import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextField
} from "@material-ui/core";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Slide, { SlideProps } from "@material-ui/core/Slide";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import React, { useContext, useState } from "react";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import LocationText from "src/components/atoms/LocationText";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import styled from "styled-components";

interface Props {
    onSignIn?: (email: string, password: string) => void;
}

const handleFormSubmit = (
    auth: AuthValue,
    routerHistory: RouterHistoryValue,
    onSignIn: Props["onSignIn"],
    notification: NotificationValue["notification"]
) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.target as any).elements["sign-in-email"].value;
    const password = (e.target as any).elements["sign-in-password"].value;

    try {
        await auth.signIn(email, password);
        onSignIn && onSignIn(email, password);
        routerHistory.history.push("?sign-in=false");
    } catch (e) {
        notification("error", e.message);
    }
};

export default (
    {
        onSignIn,
        ...props
    }: Props
) => {
    const [passwordVisibled, setPasswordVisibility] = useState<boolean>(false);

    const routerHistory = useContext(RouterHistoryContext);
    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);

    const queryParam = toObjectFromURIQuery(routerHistory.history.location.search);
    const signInDialogVisible = queryParam ? queryParam["sign-in"] === "true"
                              :              false;

    return (
        <Dialog
            open={signInDialogVisible}
            onClose={() => routerHistory.history.push("?sign-up=false")}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            {...props}
        >
            <form
                onSubmit={handleFormSubmit(auth, routerHistory, onSignIn, notification.notification)}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <LocationText text="Sign in"/>
                </DialogTitle>
                <StyledDialogContent>
                    <TextField
                        id="sign-in-email"
                        label={<LocationText text="Mail address"/>}
                        margin="normal"
                        type="email"
                        required
                    />
                    <FormControl
                        margin="normal"
                    >
                        <InputLabel htmlFor="sign-in-password"><LocationText text="Password"/></InputLabel>
                        <Input
                            id="sign-in-password"
                            type={passwordVisibled ? "text" : "password"}
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setPasswordVisibility(!passwordVisibled)}
                                    >
                                        {passwordVisibled ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </StyledDialogContent>
                <DialogActions>
                    <Button
                        onClick={() => routerHistory.history.push("?sign-up=true")}
                        color="primary"
                    >
                        <LocationText text="Create account"/>
                    </Button>
                    <Button
                        component="button"
                        color="primary"
                        type="submit"
                    >
                        <LocationText text="Sign in"/>
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Transition = (props:SlideProps) =>  <Slide direction="up" {...props}/>;

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
    }
`;
