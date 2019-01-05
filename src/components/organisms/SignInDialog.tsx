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
import { LocaleContext } from "src/components/wrappers/MainLayout";
import { ErrorNotification } from "src/contexts/NotificationListener";
import styled from "styled-components";

interface Props {
    open: boolean;
    onClose: () => void;
    onError: ErrorNotification;
    onSignIn: (email: string, password: string) => void;
    onCreateAcountButtonClick: () => void;
}

const handleFormSubmit = (onSignIn: Props["onSignIn"], onError: Props["onError"]) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.target as any).elements["sign-in-email"].value;
    const password = (e.target as any).elements["sign-in-password"].value;

    try {
        await onSignIn(email, password);
    } catch (e) {
        onError(e);
    }
};

export default (
    {
        open = false,
        onClose,
        onError,
        onSignIn,
        onCreateAcountButtonClick,
        ...props
    }: Props
) => (
    <LocaleContext.Consumer>
        {({ locale }) => (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            {...props}
        >
            <form
                onSubmit={handleFormSubmit(onSignIn, onError)}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {locale.signInDialog.signIn}
                </DialogTitle>
                <StyledDialogContent>
                    <TextField
                        id="sign-in-email"
                        label={locale.signInDialog.email}
                        margin="normal"
                        type="email"
                        required
                    />
                    <TextField
                        id="sign-in-password"
                        label={locale.signInDialog.password}
                        margin="normal"
                        type="password"
                        required
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button onClick={onCreateAcountButtonClick} color="primary">
                        {locale.signInDialog.createAcount}
                    </Button>
                    <Button
                        component="button"
                        color="primary"
                        type="submit"
                    >
                        {locale.signInDialog.signIn}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
        )}
    </LocaleContext.Consumer>
);

const Transition = (props:SlideProps) =>  <Slide direction="up" {...props} />;

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
