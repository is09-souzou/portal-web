import React from "react";
import { Snackbar, StandardProps } from "@material-ui/core";
import { SnackbarClassKey, SnackBarOrigin } from "@material-ui/core/Snackbar";
import { SnackbarContentProps } from "@material-ui/core/SnackbarContent";
import { TransitionHandlerProps } from "@material-ui/core/transitions/transition";
import { TransitionProps } from "react-transition-group/Transition";

interface Props extends StandardProps<
  React.HTMLAttributes<HTMLDivElement> & Partial<TransitionHandlerProps>,
  SnackbarClassKey
> {
    action?: React.ReactElement<any> | React.ReactElement<any>[];
    anchorOrigin?: SnackBarOrigin;
    autoHideDuration?: number;
    ContentProps?: Partial<SnackbarContentProps>;
    disableWindowBlurListener?: boolean;
    message?: React.ReactElement<any>;
    onClose?: (event: React.SyntheticEvent<any>, reason: string) => void;
    onMouseEnter?: React.MouseEventHandler<any>;
    onMouseLeave?: React.MouseEventHandler<any>;
    open?: boolean;
    resumeHideDuration?: number;
    TransitionComponent?: React.ReactType;
    transitionDuration?: TransitionProps["timeout"];
    TransitionProps?: TransitionProps;
    error: Error;
}

export default class extends React.Component<Props, { open: boolean }> {

    componentWillMount() {
        this.setState({
            open: true
        });
    }

    onClose = () => this.setState({ open: false });

    render() {

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={this.onClose}
                autoHideDuration={6000}
                ContentProps={{
                    "aria-describedby": "message-id",
                }}
                message={<span id="message-id">{this.props.error.message}</span>}
                open={this.state.open}
                {...this.props}
            />
        );
    }
}
