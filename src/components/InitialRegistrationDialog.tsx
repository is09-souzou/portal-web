import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Step,
    StepLabel,
    Stepper,
    TextField
} from "@material-ui/core";
import { SlideProps } from "@material-ui/core/Slide";
import styled         from "styled-components";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default (
    {
        open    = false,
        onClose,
        ...props
    }: Props
) => (
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

                const displayName = (e.target as any).elements["initial-registration-display-name"].value; // required
                const email       = (e.target as any).elements["initial-registration-dialog-email"].value; // required
                const career      = (e.target as any).elements["initial-registration-dialog-career"].value;
                const avatarUri   = (e.target as any).elements["initial-registration-dialog-avatar-uri"].value;
                const message     = (e.target as any).elements["initial-registration-dialog-message"].value;

            }}
        >
            <DialogTitle id="alert-dialog-slide-title">
                Initial Registration
            </DialogTitle>
            <StyledDialogContent>
                <TextField
                    id="sign-in-email"
                    label="Email Address"
                    margin="normal"
                    type="email"
                    required
                />
                <TextField
                    id="sign-in-password"
                    label="Password"
                    margin="normal"
                    type="password"
                    required
                />
            </StyledDialogContent>
            <Stepper activeStep={activeStep}>
                {["Select campaign settings", "Create an ad group", "Create an ad"].map((label, index) => {
                    const props = {};
                    const labelProps = {};
                    if (this.isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                    }
                    if (this.isStepSkipped(index)) {
                        props.completed = false;
                    }
                    return (
                        <Step key={label} {...props}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <DialogActions>
                <Button color="primary">
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
    </Dialog>
);

const Transition = (props:SlideProps) =>  <Slide direction="up" {...props} />;

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 16rem;
    }
`;
