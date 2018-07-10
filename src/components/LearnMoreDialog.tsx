import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    createMuiTheme,
    MuiThemeProvider,
    MobileStepper,
} from "@material-ui/core";
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from "@material-ui/icons";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";

interface Props {
    open: boolean;
    onClose: () => void;
    selectedWork: {
        title: string,
        imagePath: string[],
    };
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
            selectedWork,
            ...props
        } = this.props;

        const maxSteps = selectedWork.imagePath.length;

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
                        {selectedWork.imagePath.map(step =>
                            <img
                                key={step}
                                src={step}
                                alt={step}
                            />
                        )}
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={this.state.activeStep}
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
                    />

                    <DialogTitle id="simple-dialog-title">
                        {selectedWork.title}
                    </DialogTitle>
                    <StyledDialogContent>
                        <p>説明てきなやつ？</p>
                        <p>タグタグ？</p>
                        <p>制作期間？</p>
                    </StyledDialogContent>
                    <DialogActions>
                        <Button color="primary">
                            Copy URL
                        </Button>
                    </DialogActions>
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
