import {
    Button,
    DialogActions,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Slide, { SlideProps } from "@material-ui/core/Slide";
import React from "react";
import { SingUp } from "src/components/wrappers/Auth";
import { LocaleContext } from "src/components/wrappers/MainLayout";
import { NotificationListener } from "src/components/wrappers/NotificationListener";
import styled from "styled-components";
import uuidv4 from "uuid/v4";

const Transition = (props: SlideProps) =>  <Slide direction="up" {...props} />;

const handleFormSubmit = (
    onSignUp: SingUp,
    onClose: DialogProps["onClose"],
    notificationListener: NotificationListener
) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = uuidv4();

    const displayName = (e.target as any).elements["sign-up-display-name"].value;
    const email = (e.target as any).elements["sign-up-email"].value;
    const password = (e.target as any).elements["sign-up-password"].value;

    try {
        await onSignUp(
            userName, password,
            { email, "custom:display_name": displayName }
        );
        notificationListener.notification("info", "Send Mail");
    } catch (e) {
        notificationListener.errorNotification(e);
        return;
    }
    onClose && onClose(e);
};
interface Props extends DialogProps {
    notificationListener: NotificationListener;
    onSignUp: SingUp;
}

export default (
    {
        notificationListener,
        onClose,
        onSignUp,
        ...props
    }: Props
) => (
    <LocaleContext.Consumer>
        {({ locale }) => (
        <Dialog
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            {...props}
        >
            <form
                onSubmit={handleFormSubmit(onSignUp, onClose, notificationListener)}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {locale.signUpDialog.createAcount}
                </DialogTitle>
                <StyledDialogContent>
                    <TextField
                        name="sign-up-email"
                        label={locale.signUpDialog.email}
                        margin="normal"
                        type="email"
                        required
                    />
                    <TextField
                        name="sign-up-password"
                        label={locale.signUpDialog.password}
                        margin="normal"
                        type="password"
                        required
                    />
                    <TextField
                        name="sign-up-display-name"
                        label={locale.signUpDialog.displayName}
                        margin="normal"
                        type="none"
                        required
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                    >
                        {locale.signUpDialog.cancel}
                    </Button>
                    <Button component="button" color="primary" type="submit" variant="raised">
                        {locale.signUpDialog.submit}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
        )}
    </LocaleContext.Consumer>
);

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
