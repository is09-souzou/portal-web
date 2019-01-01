import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
    Typography,
} from "@material-ui/core";
import React from "react";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import NotFound from "src/components/molecules/NotFound";
import SettingsPageHost from "src/components/pages/SettingsPage/SettingsPageHost";
import StyledDialogContent from "src/components/pages/SettingsPage/StyledDialogContent";
import { PageComponentProps } from "src/App";

type Item = "credentialEmail";

interface State {
    whileEditingItem: Item[];
    updatePasswordDialogVisible: boolean;
}

export default class extends React.Component<PageComponentProps<{id: string}>, State> {

    credentialEmailInput?: any;

    state: State = {
        whileEditingItem: [],
        updatePasswordDialogVisible: false
    };

    emailUpdateSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = (e.target as any).elements["profile-credential-email"].value;

        try {
            await this.props.auth.updateEmail(email);
            this.props.notificationListener.notification("info", "Send Mail");
        } catch (e) {
            this.props.notificationListener.errorNotification(e);
        }
    }

    passwordUpdateSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const oldPassword = (e.target as any).elements["profile-old-password"].value;
        const newPassword = (e.target as any).elements["profile-new-password"].value;
        try {
            await this.props.auth.updatePassword(oldPassword, newPassword);
            this.closeUpdatePasswordDialog();
            this.props.notificationListener.notification("info", "Success update password");
        } catch (e) {
            console.error(e);
            this.props.notificationListener.errorNotification(e);
        }
    }

    setCredentialEmailInput = (x: any) => this.credentialEmailInput = x;

    addWhileEditingItem = (item: Item) => (
        () => (
            !this.state.whileEditingItem.includes(item)
         && this.setState({ whileEditingItem: this.state.whileEditingItem.concat(item) })
        )
    )

    openUpdatePasswordDialog = () => this.setState({ updatePasswordDialogVisible: true });

    closeUpdatePasswordDialog = () => this.setState({ updatePasswordDialogVisible: false });

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        if (!auth.token) {
            const queryParam = toObjectFromURIQuery(history.location.search);
            if (!((queryParam && queryParam["sign-in"] === "true") || (queryParam && queryParam["sign-up"] === "true")))
                history.push("?sign-in=true");

            return (
                <SettingsPageHost
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                >
                    <NotFound/>
                </SettingsPageHost>
            );
        }

        return (
            <SettingsPageHost
                auth={auth}
                history={history}
                notificationListener={notificationListener}
            >
                <form
                    onSubmit={this.emailUpdateSubmitHandler}
                >
                    <Typography gutterBottom variant="title">
                        Credential
                    </Typography>
                    <div>
                        <TextField
                            id="profile-credential-email"
                            label="New Mail Address"
                            margin="none"
                            helperText="Update a Credential Email"
                            InputProps={{
                                endAdornment: (
                                    this.state.whileEditingItem.includes("credentialEmail")
                                    &&
                                    <Button
                                        type="submit"
                                    >
                                        Update
                                    </Button>
                                )
                            }}
                            type="email"
                            onChange={this.addWhileEditingItem("credentialEmail")}
                            fullWidth
                            inputRef={this.setCredentialEmailInput}
                        />
                    </div>
                    <Button
                        onClick={this.openUpdatePasswordDialog}
                        variant="contained"
                        color="primary"
                    >
                        Update password
                    </Button>
                </form>
                <Dialog
                    onClose={this.closeUpdatePasswordDialog}
                    open={this.state.updatePasswordDialogVisible}
                >
                    <form
                        onSubmit={this.passwordUpdateSubmitHandler}
                    >
                        <DialogTitle
                            id="profile-update-password"
                        >
                            Update password
                        </DialogTitle>
                        <StyledDialogContent>
                            <TextField
                                id="profile-old-password"
                                label="Old password"
                                margin="normal"
                                type="password"
                                required
                            />
                            <TextField
                                id="profile-new-password"
                                label="New password"
                                margin="normal"
                                type="password"
                                required
                            />
                        </StyledDialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.closeUpdatePasswordDialog}
                            >
                                Cancel
                            </Button>
                            <Button
                                component="button"
                                color="primary"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </SettingsPageHost>
        );
    }
}
