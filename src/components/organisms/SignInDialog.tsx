import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField
} from "@material-ui/core";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Slide, { SlideProps } from "@material-ui/core/Slide";
import React from "react";
import LocationText from "src/components/atoms/LocationText";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import styled from "styled-components";

interface Props {
    open: boolean;
    onClose: () => void;
    onSignIn: (email: string, password: string) => void;
    onCreateAccountButtonClick: () => void;
}

const handleFormSubmit = (onSignIn: Props["onSignIn"], notification: NotificationValue["notification"]) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.target as any).elements["sign-in-email"].value;
    const password = (e.target as any).elements["sign-in-password"].value;

    try {
        await onSignIn(email, password);
    } catch (e) {
        notification("error", e);
    }
};

export default (
    {
        open = false,
        onClose,
        onSignIn,
        onCreateAccountButtonClick,
        ...props
    }: Props
) => (
    <NotificationContext.Consumer>
        {({ notification }) => (
            <Dialog
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                {...props}
            >
            <form
                onSubmit={handleFormSubmit(onSignIn, notification)}
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
                    <TextField
                        id="sign-in-password"
                        label={<LocationText text="Password"/>}
                        margin="normal"
                        type="password"
                        required
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button onClick={onCreateAccountButtonClick} color="primary">
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
        )}
    </NotificationContext.Consumer>
);

const Transition = (props:SlideProps) =>  <Slide direction="up" {...props}/>;

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
