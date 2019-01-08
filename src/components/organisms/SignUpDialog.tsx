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
import { SingUp } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import styled from "styled-components";
import uuidv4 from "uuid/v4";

const Transition = (props: SlideProps) =>  <Slide direction="up" {...props}/>;

const handleFormSubmit = (
    onSignUp: SingUp,
    onClose: DialogProps["onClose"],
    notification: NotificationValue["notification"]
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
        notification("info", "Send Mail");
    } catch (e) {
        notification("error", e);
        return;
    }
    onClose && onClose(e);
};
interface Props extends DialogProps {
    onSignUp: SingUp;
}

export default (
    {
        onClose,
        onSignUp,
        ...props
    }: Props
) => (
    <LocalizationContext.Consumer>
        {({ locationText }) => (
            <NotificationContext.Consumer>
                {({ notification }) => (
                    <Dialog
                        TransitionComponent={Transition}
                        keepMounted
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                        {...props}
                    >
                        <form
                            onSubmit={handleFormSubmit(onSignUp, onClose, notification)}
                        >
                            <DialogTitle id="alert-dialog-slide-title">
                                {locationText.signUpDialog.createAcount}
                            </DialogTitle>
                            <StyledDialogContent>
                                <TextField
                                    name="sign-up-email"
                                    label={locationText.signUpDialog.email}
                                    margin="normal"
                                    type="email"
                                    required
                                />
                                <TextField
                                    name="sign-up-password"
                                    label={locationText.signUpDialog.password}
                                    margin="normal"
                                    type="password"
                                    required
                                />
                                <TextField
                                    name="sign-up-display-name"
                                    label={locationText.signUpDialog.displayName}
                                    margin="normal"
                                    type="none"
                                    required
                                />
                            </StyledDialogContent>
                            <DialogActions>
                                <Button
                                    onClick={onClose}
                                >
                                    {locationText.signUpDialog.cancel}
                                </Button>
                                <Button component="button" color="primary" type="submit" variant="contained">
                                    {locationText.signUpDialog.submit}
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                )}
            </NotificationContext.Consumer>
        )}
    </LocalizationContext.Consumer>
);

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
