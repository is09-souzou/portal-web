import React from "react";
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
import styled from "styled-components";
import { DialogProps } from "@material-ui/core/Dialog";

const Transition = (props: any) =>  <Slide direction="up" {...props} />;

interface Props extends DialogProps {
    onSignUp: (email: string, password: string) => Promise<any>;
}

interface State {
    activeStep: number;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            activeStep: 0
        });
    }

    backStep = () => this.setState({ activeStep: this.state.activeStep - 1 });
    nextStep = () => this.setState({ activeStep: this.state.activeStep + 1 });

    render() {

        const {
            onClose,
            onSignUp,
            ...props
        } = this.props;

        return (
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

                        // onSignUp(email, password);
                        console.log(email, password);
                    }}
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        Create Account
                    </DialogTitle>
                    <Stepper activeStep={this.state.activeStep}>
                        <Step
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => this.setState({ activeStep: 0 })}
                        >
                            <StepLabel>test</StepLabel>
                        </Step>
                        <Step
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => this.setState({ activeStep: 1 })}
                        >
                            <StepLabel>test</StepLabel>
                        </Step>
                        <Step
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => this.setState({ activeStep: 2 })}
                        >
                            <StepLabel>test</StepLabel>
                        </Step>
                    </Stepper>
                    <StyledDialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="sign-up-email"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="sign-up-password"
                            label="Password"
                            type="password"
                            fullWidth
                        />
                    </StyledDialogContent>
                    <DialogActions>
                        <Button
                            onClick={onClose}
                        >
                            cancel
                        </Button>
                        <FlexibleSpace/>
                        {this.state.activeStep &&
                            <Button
                                onClick={this.backStep}
                            >
                                back
                            </Button>
                        }
                        {this.state.activeStep !== 2 ?
                            <Button onClick={this.nextStep} variant="raised">
                                next
                            </Button>
                      :     <Button component="button" color="primary" type="submit">
                                submit
                            </Button>
                        }
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 32rem;
    }
`;

const FlexibleSpace = styled.span`
    flex-grow: 1;
`;
