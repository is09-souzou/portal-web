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
import styled from "styled-components";

interface Props {
    open: boolean;
    onClose: () => void;
    onSignIn: (email: string, password: string) => void;
}

export default (
    {
        open    = false,
        onClose,
        onSignIn,
        ...props
    }: Props
) => (
    <StyledDialog
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

                const email = (e.target as any).elements["email"].value;
                const password = (e.target as any).elements["password"].value;

                console.log(email, password);
                const jwt = await onSignIn(email, password);
                console.log(jwt);
            }}
        >
            <DialogTitle id="alert-dialog-slide-title">
                Sign In
            </DialogTitle>
            <StyledDialogContent>
                <TextField
                    id="email"
                    label="email"
                    margin="normal"
                    type="email"
                    required
                />
                <TextField
                    id="password"
                    label="password"
                    margin="normal"
                    type="password"
                    required
                />
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Create Account
                </Button>
                <Button
                    component="button"
                    color="primary"
                    type="submit"
                >
                    Sign In
                </Button>
            </DialogActions>
        </form>
    </StyledDialog>
);

const Transition = (props:any) =>  <Slide direction="up" {...props} />;

const StyledDialog = styled(Dialog)`
    border-radius: 18rem;
`;

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
