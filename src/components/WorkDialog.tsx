import React from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    createMuiTheme,
    MuiThemeProvider,
    MobileStepper,
    Chip,
} from "@material-ui/core";
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from "@material-ui/icons";
import styled         from "styled-components";
import SwipeableViews from "react-swipeable-views";
import { Work }       from "../graphQL/type";

interface Props {
    open: boolean;
    onClose: () => void;
    work?: Work;
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

    handleNext = () => this.setState(prevState => ({ activeStep: prevState.activeStep + 1 }));

    handleBack = () => this.setState(prevState => ({ activeStep: prevState.activeStep - 1 }));

    render() {
        const {
            open = false,
            onClose,
            work,
            ...props
        } = this.props;

        if (!work)
            return null;

        const maxSteps = work.imageUris ? work.imageUris!.length : 0;

        return (
            <MuiThemeProvider theme={theme}>
                <StyledDialog
                    open={open}
                    onClose={onClose}
                    keepMounted
                    aria-labelledby="simple-dialog-title"
                    {...props}
                >
                    <SwipeableViews
                        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                        index={this.state.activeStep}
                        enableMouseEvents
                    >
                        {work.imageUris ? (
                            work.imageUris!.map(x =>
                                <img
                                    key={x}
                                    src={x}
                                />
                            )
                        ) : (
                            <img
                                src={"img/no-image.png"}
                            />
                        )}
                    </SwipeableViews>
                    {work.imageUris && work.imageUris.length > 1 && (
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={this.state.activeStep}
                            backButton={
                                <Button
                                    size="small"
                                    onClick={this.handleBack}
                                    disabled={this.state.activeStep === 0}
                                >
                                    {theme.direction === "rtl" ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}
                                    Back
                                </Button>
                            }
                            nextButton={
                                <Button
                                    size="small"
                                    onClick={this.handleNext}
                                    disabled={this.state.activeStep === maxSteps - 1}
                                >
                                    Next
                                    {theme.direction === "rtl" ? (
                                        <KeyboardArrowLeft />
                                    ) : (
                                        <KeyboardArrowRight />
                                    )}
                                </Button>
                            }
                        />
                    )}
                    <DialogTitle id="simple-dialog-title">
                        {work.title}
                    </DialogTitle>
                    <StyledDialogContent>
                        <div>{work.description}</div>
                        <div>
                            {work.tags && work.tags.map(x =>
                                <StyledChip
                                    key={x}
                                    clickable={false}
                                    label={x}
                                />
                            )}
                        </div>
                    </StyledDialogContent>
                </StyledDialog>
            </MuiThemeProvider>
        );
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#ffc246",
            main: "#ff9100",
            dark: "#c56200",
            contrastText: "#fff",
        },
    },
    overrides: {
        MuiDialog: {
            paperWidthSm: {
                maxWidth: "800px",
                width: "600px",
            },
        },
    },
});

const StyledDialog = styled(Dialog)`
    && {
        maxWidth: 100sm;
        paperWidthSm: 100sm;
    }
`;

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 30rem;
    }
`;

const StyledChip = styled(Chip)`
    && {
        > :not(:last-child) {
            margin-right: 1rem;
        }
    }
`;
