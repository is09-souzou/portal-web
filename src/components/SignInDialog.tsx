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

export default ({
    open = false,
    onClose = ():void => undefined,
    ...props
}) => (
    <StyledDialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        {...props}
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
            <Button onClick={onClose} color="primary">
                Sign In
            </Button>
        </DialogActions>
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
