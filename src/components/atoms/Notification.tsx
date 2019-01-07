import {
    withTheme,
    IconButton,
    Snackbar,
    StandardProps
} from "@material-ui/core";
import { TransitionHandlerProps } from "@material-ui/core/transitions/transition";
import { SnackbarClassKey, SnackbarOrigin } from "@material-ui/core/Snackbar";
import SnackbarContent, { SnackbarContentProps } from "@material-ui/core/SnackbarContent";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import { TransitionProps } from "react-transition-group/Transition";
import styled from "styled-components";

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

export default (
    {
        onClose,
        type,
        message,
        ...props
    }: Props
) => {
    const [visibled, setVisibility] = useState<boolean>(true);
    const _onClose = () => setVisibility(false);

    return (
        <Snackbar
            anchorOrigin={{
                horizontal: "left",
                vertical: "bottom"
            }}
            onClose={onClose || _onClose}
            autoHideDuration={6000}
            ContentProps={{
                "aria-describedby": "message-id",
            }}
            open={visibled}
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
                        onClick={onClose || _onClose}
                    >
                        <StyledCloseIcon />
                    </IconButton>
                ]}
            />
        </Snackbar>
    );
};

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
