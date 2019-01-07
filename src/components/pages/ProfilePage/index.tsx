import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    TextField,
} from "@material-ui/core";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import React, { useContext, useRef, useState, Fragment } from "react";
import { Mutation,  MutationFn, OperationVariables, Query, QueryResult } from "react-apollo";
import createSignedUrl from "src/api/createSignedUrl";
import fileUploadToS3 from "src/api/fileUploadToS3";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import ImageInput from "src/components/atoms/ImageInput";
import NotFound from "src/components/molecules/NotFound";
import ChipList from "src/components/pages/ProfilePage/ChipList";
import ProfileContent from "src/components/pages/ProfilePage/ProfileContent";
import ProfilePageHeader from "src/components/pages/ProfilePage/ProfilePageHeader";
import ProfilePageHost from "src/components/pages/ProfilePage/ProfilePageHost";
import UserAvatar from "src/components/pages/ProfilePage/UserAvatar";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import { User } from "src/graphQL/type";
import { PageComponentProps } from "src/App";

interface Chip {
    key  : string;
    label: string;
}

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
            career
            avatarUri
            message
            skillList
        }
    }
`);

export default (props: PageComponentProps<{}>) => {
    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);

    return (
        <Query
            query={QueryGetUser}
            variables={{ id: auth.token!.payload.sub }}
            fetchPolicy="network-only"
        >
            {(query =>
                (
                    <ProfilePageHost
                        {...props}
                    >
                        {
                            query.loading         ? <GraphQLProgress/>
                          : query.error           ? (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notification.ErrorComponent error={query.error}/>
                                </Fragment>
                            )
                          : !(query.data.getUser) ? <NotFound/>
                          :                   (
                            <ProfilePage
                                auth={auth}
                                notification={notification}
                                query={query}
                            />
                            )
                        }
                    </ProfilePageHost>
                )
            )}
        </Query>
    );
};

const MutationUpdateUser = gql(`
    mutation updateUser(
        $user: UserUpdate!
    ) {
        updateUser(
            user: $user
        ) {
            id
        }
    }
`);

interface Props extends React.Props<{}> {
    auth: AuthValue;
    notification: NotificationValue;
    query: QueryResult<any, {
        id: any;
    }>;
}

const ProfilePage = (
    {
        auth,
        notification,
        query: {
            loading,
            error,
            data,
            refetch
        },
        ...props
    }: Props
) => {

    const [chipsData, setChipsData] = useState<Chip[]>([]);
    const [editableAvatarDialogOpend, setEditableAvatarDialogOpen] = useState<boolean>(false);
    const [uploadingAvatarImage, setUploadingAvatarImage] = useState<boolean>(false);

    const displayNameInputElement = useRef<HTMLInputElement>(null);
    const emailInputElement = useRef<HTMLInputElement>(null);
    const careerInputElement = useRef<HTMLInputElement>(null);
    const messageInputElement = useRef<HTMLInputElement>(null);

    const localization = useContext(LocalizationContext);
    const routerHistory = useContext(RouterHistoryContext);

    const handleUpdateUserFormSubmit = (
        updateUser: MutationFn<any, OperationVariables>,
        currentUser: User
    ) => async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.token) return;

        if (!(displayNameInputElement.current && emailInputElement.current && messageInputElement.current && careerInputElement.current)) return;

        await updateUser({
            variables: {
                user: {
                    id: auth.token!.payload.sub,
                    displayName: displayNameInputElement.current!.value,
                    email: emailInputElement.current!.value,
                    message: messageInputElement.current!.value,
                    career: careerInputElement.current!.value,
                    skillList: chipsData.map(x => x.label) as string[],
                }
            },
            optimisticResponse: {
                __typename: "Mutation",
                updateUser: {
                    id: auth.token!.payload.sub,
                    displayName: displayNameInputElement.current!.value,
                    email: emailInputElement!.current!.value,
                    message: messageInputElement!.current!.value,
                    career: careerInputElement!.current!.value,
                    skillList: chipsData.map(x => x.label) as string[],
                    __typename: "User"
                }
            },
        });

        notification.notification("info", "Update Profile!");
        routerHistory.history.push(`/users/${currentUser.id}`);
    };

    const handleUpdateAvatarFormSubmit = (
        updateUser: MutationFn<any, OperationVariables>,
        refetch: (variables?: { id: any; } | undefined) => Promise<ApolloQueryResult<any>>
    ) => async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.token) return;

        const image = (e.target as any).elements["newAvatarImage"].files[0];

        try {
            setUploadingAvatarImage(true);
            const {
                signedUrl,
                uploadedUrl
            } = await createSignedUrl({
                jwt: auth.token!.jwtToken,
                userId: auth.token!.payload.sub,
                type: "profile",
                mimetype: image.type
            });

            await Promise.all([
                fileUploadToS3({
                    url: signedUrl,
                    file: image
                }),
                updateUser({
                    variables: {
                        user: {
                            avatarUri: uploadedUrl,
                            id: auth.token!.payload.sub,
                        }
                    },
                    optimisticResponse: {
                        __typename: "Mutation",
                        updateUser: {
                            id: auth.token!.payload.sub,
                            __typename: "User"
                        }
                    },
                })
            ]);

            refetch();
            setUploadingAvatarImage(false);
            closeEditableAvatarDialog();
        } catch (e) {
            setUploadingAvatarImage(false);
            notification.notification("error", e);
        }
    };

    const deleteChip = (data: Chip) => () => {
        setChipsData(chipsData.filter((x: Chip): boolean => data.key !== x.key));
    };

    const tagInputKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();
        if (chipsData.length >= 5)
            return;

        const inputValue = (e.target as any).value;
        if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
            e.preventDefault();
            if (inputValue.length > 1) {
                if (!chipsData.some(x => x.label === inputValue))
                    setChipsData(
                        chipsData.concat({
                            key: (e.target as any).value,
                            label: (e.target as any).value
                        })
                    );

                (e.target as any).value = "";
            }
        }
    };

    const openEditableAvatarDialog = () => setEditableAvatarDialogOpen(true);

    const closeEditableAvatarDialog = () => setEditableAvatarDialogOpen(false);

    const moveUserPage = (id: string) => (_: React.MouseEvent) => routerHistory.history.push(`/users/${id}`);

    const currentUser = query.data.getUser as User;

    if (currentUser) {
        this.setState({
            chipsData: (currentUser.skillList || []).map((x: string) => ({ key: x, label: x }))
        });
    }

    return (
        <Mutation
            mutation={MutationUpdateUser}
            refetchQueries={[]}
        >
            {updateUser => (
                <form
                    onSubmit={handleUpdateUserFormSubmit(updateUser, currentUser)}
                >
                    <ProfilePageHeader>
                        <img
                            src={currentUser.avatarUri}
                        />
                        <div>
                            <UserAvatar
                                src={currentUser.avatarUri}
                                onClick={openEditableAvatarDialog}
                            />
                            <div>
                                <TextField
                                    id="profile-name"
                                    margin="dense"
                                    label={localization.locationText.profile.displayName}
                                    defaultValue={currentUser.displayName}
                                    required
                                    inputRef={displayNameInputElement}
                                />
                                <TextField
                                    id="profile-email"
                                    margin="dense"
                                    label={localization.locationText.profile.mailAdress}
                                    type="email"
                                    defaultValue={currentUser.email}
                                    inputRef={emailInputElement}
                                />
                            </div>
                        </div>
                    </ProfilePageHeader>
                    <Divider />
                    <ProfileContent>
                        <TextField
                            id="profile-message"
                            label={localization.locationText.profile.message}
                            margin="normal"
                            defaultValue={currentUser.message}
                            inputRef={messageInputElement}
                        />
                        <TextField
                            id="profile-career"
                            label={localization.locationText.profile.career}
                            margin="normal"
                            defaultValue={currentUser.career}
                            multiline
                            rows={4}
                            inputRef={careerInputElement}
                        />
                        <div>
                            <TextField
                                label={localization.locationText.profile.skill}
                                placeholder={localization.locationText.profile.inputSkill}
                                onKeyDown={tagInputKeyDown}
                                margin="normal"
                                inputProps={{
                                    maxLength: 10,
                                }}
                            />
                            <ChipList>
                                {(this.state.chipsData || (currentUser.skillList || []).map((x: string) => ({ key: x, label: x })))
                                    .map((data: any) =>
                                        <Chip
                                            key={data.key}
                                            clickable={false}
                                            label={data.label}
                                            onDelete={deleteChip(data)}
                                        />
                                    )
                                }
                            </ChipList>
                        </div>
                        <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={moveUserPage(currentUser.id)}
                            >
                                {localization.locationText.profile.cancel}
                            </Button>
                            <Button
                                type="submit"
                                component="button"
                                variant="contained"
                                color="primary"
                            >
                                {localization.locationText.profile.save}
                            </Button>
                        </div>
                    </ProfileContent>
                    <Dialog
                        open={editableAvatarDialogIsVisible}
                        onClose={closeEditableAvatarDialog}
                        aria-labelledby="editable-avatar-dialog-title"
                    >
                        <form
                            onSubmit={handleUpdateAvatarFormSubmit(updateUser, refetch)}
                        >
                            <DialogTitle
                                id="editable-avatar-dialog-title"
                            >
                                {localization.locationText.profile.dialog.title}
                            </DialogTitle>
                            <DialogContent>
                                <ImageInput
                                    name="newAvatarImage"
                                    width="256"
                                    height="256"
                                />
                            </DialogContent>
                            {uploadingAvatarImage && <LinearProgress/>}
                            <DialogActions>
                                <Button
                                    onClick={closeEditableAvatarDialog}
                                >
                                    {localization.locationText.profile.dialog.cancel}
                                </Button>
                                <Button
                                    component="button"
                                    color="primary"
                                    type="submit"
                                >
                                    {localization.locationText.profile.dialog.submit}
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </form>
            )}
        </Mutation>
    );
};
