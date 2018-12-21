import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    TextField
} from "@material-ui/core";
import { SlideProps } from "@material-ui/core/Slide";
import styled         from "styled-components";
import { LocaleContext }     from "./wrapper/MainLayout";
import { ErrorNotification } from "./wrapper/NotificationListener";

interface Props {
    open: boolean;
    onClose: () => void;
    onError: ErrorNotification;
    onSignIn: (email: string, password: string) => void;
    onCreateAcountButtonClick: () => void;
}

export default (
    {
        open    = false,
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
                // tslint:disable-next-line:jsx-no-lambda
                onSubmit={async e => {
                    e.preventDefault();

                    const email = (e.target as any).elements["sign-in-email"].value;
                    const password = (e.target as any).elements["sign-in-password"].value;

                    try {
                        await onSignIn(email, password);
                    } catch (e) {
                        onError(e);
                    }
                }}
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

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
