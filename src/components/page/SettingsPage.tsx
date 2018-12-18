import React from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    Typography,
} from "@material-ui/core";
import * as H              from "history";
import styled              from "styled-components";
import { PageComponentProps } from "../../App";
import Header                 from "../Header";
import NotFound               from "../NotFound";
import Page                   from "../Page";
import { AuthProps }                 from "../wrapper/Auth";
import { NotificationListenerProps } from "../wrapper/NotificationListener";
import toObjectFromURIQuery from "../../api/toObjectFromURIQuery";

type Item = "credentialEmail";

interface State {
    whileEditingItem: Item[];
    updatePasswordDialogVisible: boolean;
}

export default class extends React.Component<PageComponentProps<{id: string}>, State> {

    credentialEmailInput?: any;

    componentWillMount() {
        this.setState({
            whileEditingItem: [],
            updatePasswordDialogVisible: false
        });
    }

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
                    // tslint:disable-next-line:jsx-no-lambda
                    onSubmit={async e => {
                        e.preventDefault();

                        const email = (e.target as any).elements["profile-credential-email"].value;

                        try {
                            await this.props.auth.updateEmail(email);
                            notificationListener.notification("info", "Send Mail");
                        } catch (e) {
                            notificationListener.errorNotification(e);
                            return;
                        }
                    }}
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
                            // tslint:disable-next-line:jsx-no-lambda
                            inputRef={x => this.credentialEmailInput = x}
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
                        // tslint:disable-next-line:jsx-no-lambda
                        onSubmit={async e => {
                            e.preventDefault();

                            const oldPassword = (e.target as any).elements["profile-old-password"].value;
                            const newPassword = (e.target as any).elements["profile-new-password"].value;
                            try {
                                await this.props.auth.updatePassword(oldPassword, newPassword);
                                this.closeUpdatePasswordDialog();
                                notificationListener.notification("info", "Success update password");
                            } catch (e) {
                                console.error(e);
                                notificationListener.errorNotification(e);
                            }
                        }}
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

const StyledDialogContent = styled(DialogContent)`
    && {
        width: 20rem;
        max-width: 20rem;
        display: flex;
        flex-direction: column;
    }
`;

const SettingsPageHost = (
    {
        auth,
        history,
        notificationListener,
        children,
        ...props
    }: { children: any, history: H.History } & AuthProps & NotificationListenerProps
) => (
    <PageHost {...props}>
        <Header
            auth={auth}
            history={history}
            notificationListener={notificationListener}
        />
        <div>
            {children}
        </div>
    </PageHost>
);

const PageHost = styled(Page)`
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
    > :nth-child(2) {
        > :nth-child(1) {
                > :nth-child(n + 1) {
                    margin-top: 4rem;
                }
            }
        }
    @media (max-width: 768px) {
        width: unset;
        margin: 0 4rem;
    }
`;
