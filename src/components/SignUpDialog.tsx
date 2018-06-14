import React from "react";
import { Mutation } from "react-apollo";
import MutationCreateUser from "../GraphQL/mutation/MutationCreateUser";
import styled from "styled-components";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    TextField,
    Button,
} from "@material-ui/core";
import { DialogProps } from "@material-ui/core/Dialog";
import { SingUp, SingIn } from "./wrapper/Auth";
import { OnError } from "./wrapper/ErrorListener";

const Transition = (props: any) =>  <Slide direction="up" {...props} />;

interface Props extends DialogProps {
    onCustomError: OnError;
    onSignUp: SingUp;
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
        <Mutation mutation={MutationCreateUser}>
            {(createUser, { data }) => console.log(data) || (
                <form
                    // tslint:disable-next-line:jsx-no-lambda
                    onSubmit={async e => {
                        e.preventDefault();

                        const displayName = (e.target as any).elements["sign-up-display-name"].value;
                        const email = (e.target as any).elements["sign-up-email"].value;
                        const password = (e.target as any).elements["sign-up-password"].value;

                        try {

                            await onSignUp(email, password, { "custom:display_name": displayName });
                            // createUser({
                            //     variables: {
                            //         email,
                            //         displayName,
                            //         id: token.payload.sub
                            //     }
                            // });
                        } catch (e) {
                            onCustomError(e);
                            return;
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
            )}
        </Mutation>
    </Dialog>
);

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
