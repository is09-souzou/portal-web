import React                                     from "react";
import {
    Snackbar,
    StandardProps,
    IconButton,
    withTheme
}                                                from "@material-ui/core";
import { SvgIconProps }                          from "@material-ui/core/SvgIcon";
import { SnackbarClassKey, SnackbarOrigin }      from "@material-ui/core/Snackbar";
import SnackbarContent, { SnackbarContentProps } from "@material-ui/core/SnackbarContent";
import { TransitionHandlerProps }                from "@material-ui/core/transitions/transition";
import CloseIcon                                 from "@material-ui/icons/Close";
import { TransitionProps }                       from "react-transition-group/Transition";
import styled                                    from "styled-components";

interface Props extends StandardProps<
    React.HTMLAttributes<HTMLDivElement> & Partial<TransitionHandlerProps>,
    SnackbarClassKey
> {
    action?: React.ReactElement<any> | React.ReactElement<any>[];
    anchorOrigin?: SnackbarOrigin;
    autoHideDuration?: number;
    ContentProps?: Partial<SnackbarContentProps>;
    disableWindowBlurListener?: boolean;
    message: string;
    onClose?: () => void;
    onMouseEnter?: React.MouseEventHandler<any>;
    onMouseLeave?: React.MouseEventHandler<any>;
    open?: boolean;
    resumeHideDuration?: number;
    TransitionComponent?: React.ReactType;
    transitionDuration?: TransitionProps["timeout"];
    TransitionProps?: TransitionProps;
    type: "info" | "error";
}

interface State {
    open: boolean;
}

export default class extends React.Component<Props, State> {

    state: State = {
        open: true
    };

    onClose = () => this.setState({ open: false });

    render() {

        const {
            onClose,
            type,
            message,
            ...props
        } = this.props;

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={onClose || this.onClose}
                autoHideDuration={6000}
                ContentProps={{
                    "aria-describedby": "message-id",
                }}
                open={this.state.open}
                {...props}
            >
                <StyledSnackbarContent
                    type={type}
                    message={<span id="message-id">{message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.props.onClose || this.onClose}
                        >
                            <StyledCloseIcon />
                        </IconButton>
                    ]}
                />
            </Snackbar>
        );
    }
}

const StyledSnackbarContentBase = styled(SnackbarContent as React.SFC<SnackbarContentProps>)`
    && {
        ${(props: any) => props.type === "error" ? `background-color: ${props.theme.palette.error.dark}` : ""}
    }
`;

const StyledSnackbarContent = withTheme()(
    (props: any) => <StyledSnackbarContentBase {...props}/>
);

const StyledCloseIcon = styled(CloseIcon as React.SFC<SvgIconProps>)`
    && {
        font-size: 1.5rem;
    }
`;
