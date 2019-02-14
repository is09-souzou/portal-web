import {
    Button,
    DialogActions,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Slide, { SlideProps } from "@material-ui/core/Slide";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import React, { useContext, useState } from "react";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import LocationText from "src/components/atoms/LocationText";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import styled from "styled-components";
import uuidv4 from "uuid/v4";

const Transition = (props: SlideProps) =>  <Slide direction="up" {...props}/>;

type SignUp = (email: string, password: string) => void;

const handleFormSubmit = (
    auth: AuthValue,
    notification: NotificationValue["notification"],
    onSignUp?: SignUp
) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = uuidv4();

    const displayName = (e.target as any).elements["sign-up-display-name"].value;
    const email = (e.target as any).elements["sign-up-email"].value;
    const password = (e.target as any).elements["sign-up-password"].value;

    try {
        await auth.signUp(
            userName, password,
            { email, "custom:display_name": displayName }
        );

        onSignUp && onSignUp(email, password);
        notification("info", "Send Mail");
    } catch (e) {
        notification("error", e.message);
        return;
    }
};
interface Props {
    onSignUp?: SignUp;
}

export default (
    {
        onSignUp,
        ...props
    }: Props
) => {
    const [passwordVisibled, setPasswordVisibility] = useState<boolean>(false);

    const routerHistory = useContext(RouterHistoryContext);
    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);

    const queryParam = toObjectFromURIQuery(routerHistory.history.location.search);
    const signUpDialogVisible = queryParam ? queryParam["sign-up"] === "true"
                              :              false;

    return (
        <Dialog
            open={signUpDialogVisible}
            onClose={() => routerHistory.history.push("?sign-in=false")}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            {...props}
        >
            <form
                onSubmit={handleFormSubmit(auth, notification.notification, onSignUp)}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <LocationText text="Create account"/>
                </DialogTitle>
                <StyledDialogContent>
                    <TextField
                        name="sign-up-email"
                        label={<LocationText text="Mail address"/>}
                        margin="normal"
                        type="email"
                        required
                    />
                    <FormControl
                        margin="normal"
                    >
                        <TextField
                            id="sign-up-password"
                            label={<LocationText text="Password"/>}
                            type={passwordVisibled ? "text" : "password"}
                            helperText={<LocationText text="Password helpertext"/>}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setPasswordVisibility(!passwordVisibled)}
                                        >
                                            {passwordVisibled ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <TextField
                        name="sign-up-display-name"
                        label={<LocationText text="Display name"/>}
                        margin="normal"
                        type="none"
                        required
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button onClick={() => routerHistory.history.push("?sign-in=true")} color="primary">
                        <LocationText text="Sign in"/>
                    </Button>
                    <Button component="button" color="primary" type="submit" variant="contained">
                        <LocationText text="Create"/>
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
    }
`;
