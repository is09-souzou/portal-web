import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
    Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import LocationText from "src/components/atoms/LocationText";
import NotFound from "src/components/molecules/NotFound";
import Host from "src/components/pages/SettingsPage/Host";
import StyledDialogContent from "src/components/pages/SettingsPage/StyledDialogContent";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";

type Item = "credentialEmail";

export default () => {

    const [whileEditingItem, setWhileEditingItem] = useState<Item[]>([]);
    const [updatePasswordDialogOpend, setUpdatePasswordDialogOpen] = useState<boolean>(false);

    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);
    const routerHistory = useContext(RouterHistoryContext);

    if (!auth.token) {
        const queryParam = toObjectFromURIQuery(routerHistory.history.location.search);
        if (!((queryParam && queryParam["sign-in"] === "true") || (queryParam && queryParam["sign-up"] === "true")))
            routerHistory.history.push("?sign-in=true");

        return (
            <Host>
                <NotFound/>
            </Host>
        );
    }

    return (
        <Host>
            <form
                onSubmit={handleUpdateEmailFromSubmit({ auth, notification })}
            >
                <Typography gutterBottom variant="h6">
                    {<LocationText text="Credential"/>}
                </Typography>
                <div>
                    <TextField
                        id="profile-credential-email"
                        label={<LocationText text="New mail address"/>}
                        margin="none"
                        helperText={<LocationText text="Update a credential email"/>}
                        InputProps={{
                            endAdornment: (
                                whileEditingItem.includes("credentialEmail") && (
                                    <Button
                                        type="submit"
                                    >
                                        {<LocationText text="Update"/>}
                                    </Button>
                                )
                            )
                        }}
                        type="email"
                        onChange={() => !whileEditingItem.includes("credentialEmail") && setWhileEditingItem(whileEditingItem.concat("credentialEmail"))}
                        fullWidth
                    />
                </div>
                <Button
                    onClick={() => setUpdatePasswordDialogOpen(true)}
                    variant="contained"
                    color="primary"
                >
                    {<LocationText text="Update password"/>}
                </Button>
            </form>
            <Dialog
                onClose={() => setUpdatePasswordDialogOpen(false)}
                open={updatePasswordDialogOpend}
            >
                <form
                    onSubmit={handleUpdatePasswordSubmit({ auth, notification, setUpdatePasswordDialogOpen })}
                >
                    <DialogTitle
                        id="profile-update-password"
                    >
                        {<LocationText text="Update password"/>}
                    </DialogTitle>
                    <StyledDialogContent>
                        <TextField
                            id="profile-old-password"
                            label={<LocationText text="Old password"/>}
                            margin="normal"
                            type="password"
                            required
                        />
                        <TextField
                            id="profile-new-password"
                            label={<LocationText text="New password"/>}
                            margin="normal"
                            type="password"
                            required
                        />
                    </StyledDialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setUpdatePasswordDialogOpen(false)}
                        >
                            {<LocationText text="Cancel"/>}
                        </Button>
                        <Button
                            component="button"
                            color="primary"
                            type="submit"
                        >
                            {<LocationText text="Update"/>}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Host>
    );
};

const handleUpdateEmailFromSubmit = (
    {
        auth,
        notification
    }: {
        auth: AuthValue,
        notification: NotificationValue
    }
) => async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (e.target as any).elements["profile-credential-email"].value;

    try {
        await auth.updateEmail(email);
        notification.notification("info", "Send Mail");
    } catch (e) {
        notification.notification("error", e.message);
    }
};

const handleUpdatePasswordSubmit = (
    {
        auth,
        notification,
        setUpdatePasswordDialogOpen
    }: {
        auth: AuthValue,
        notification: NotificationValue,
        setUpdatePasswordDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    }
) => async (e: React.FormEvent) => {
    e.preventDefault();

    const oldPassword = (e.target as any).elements["profile-old-password"].value;
    const newPassword = (e.target as any).elements["profile-new-password"].value;
    try {
        await auth.updatePassword(oldPassword, newPassword);
        setUpdatePasswordDialogOpen(false);
        notification.notification("info", "Success update password");
    } catch (e) {
        console.error(e);
        notification.notification("error", e.message);
    }
};
