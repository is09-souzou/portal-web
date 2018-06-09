import React from "react";
import styled from "styled-components";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Button,
} from "@material-ui/core";
import { DialogProps } from "@material-ui/core/Dialog";

const Transition = (props: any) =>  <Slide direction="up" {...props} />;

interface Props extends DialogProps {
    onCustomError: (error: Error) => void;
    onSignUp: (email: string, password: string) => Promise<any>;
}

export default (
    {
        onCustomError,
        onClose,
        onSignUp,
        ...props
    }: Props
) => (
    <Dialog
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        {...props}
    >
        <form
            // tslint:disable-next-line:jsx-no-lambda
            onSubmit={async e => {
                e.preventDefault();

                const email = (e.target as any).elements["sign-up-email"].value;
                const password = (e.target as any).elements["sign-up-password"].value;

                try {
                    await onSignUp(email, password);
                } catch (e) {
                    onCustomError(e);
                }
                onClose && onClose(e);
            }}
        >
            <DialogTitle id="alert-dialog-slide-title">
                Create Account
            </DialogTitle>
            <StyledDialogContent>
                <TextField
                    name="sign-up-display-name"
                    label="Display Name"
                    margin="normal"
                    type="none"
                    required
                />
                <TextField
                    name="sign-up-email"
                    label="Email Address"
                    margin="normal"
                    type="email"
                    required
                />
                <TextField
                    name="sign-up-password"
                    label="Password"
                    margin="normal"
                    type="password"
                    required
                />
            </StyledDialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                >
                    cancel
                </Button>
                <Button component="button" color="primary" type="submit" variant="raised">
                    submit
                </Button>
            </DialogActions>
        </form>
    </Dialog>
);

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
