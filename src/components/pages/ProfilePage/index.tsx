import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    TextField,
} from "@material-ui/core";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import React, { useContext, useRef, useState, Fragment } from "react";
import { Mutation,  MutationFn, OperationVariables, Query, QueryResult } from "react-apollo";
import createSignedUrl from "src/api/createSignedUrl";
import fileUploadToS3 from "src/api/fileUploadToS3";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import ImageInput from "src/components/atoms/ImageInput";
import LocationText from "src/components/atoms/LocationText";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import UserHeader from "src/components/molecules/UserHeader";
import ChipList from "src/components/pages/ProfilePage/ChipList";
import Host from "src/components/pages/ProfilePage/Host";
import ProfileContent from "src/components/pages/ProfilePage/ProfileContent";
import ShortTextField from "src/components/pages/ProfilePage/ShortTextField";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { User } from "src/graphQL/type";

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

export default (props: React.Props<{}>) => {
    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);
    const routerHistory = useContext(RouterHistoryContext);

    if (!auth.token) {
        routerHistory.history.push("/?sign-up=true");
        return null;
    }

    return (
        <Host
            {...props}
            ref={props.ref as any}
        >
            <Query
                query={QueryGetUser}
                variables={{ id: auth.token!.payload.sub }}
                fetchPolicy="network-only"
            >
                {(query => (
                    query.loading                       ? (
                        <Fragment>
                            <Header
                                title={<LocationText text="Profile"/>}
                                searchEditable={false}
                            />
                            <GraphQLProgress/>
                        </Fragment>
                    )
                  : query.error                         ? (
                        <Fragment>
                            <Header
                                title={<LocationText text="Error"/>}
                                searchEditable={false}
                            />
                            <ErrorTemplate/>
                            <notification.ErrorComponent message={query.error.message}/>
                        </Fragment>
                    )
                  : !(query.data && query.data.getUser) ? (
                        <Fragment>
                            <Header
                                title={<LocationText text="Not Found"/>}
                                searchEditable={false}
                            />
                            <NotFound/>
                        </Fragment>
                  )
                  :                                       (
                        <Fragment>
                            <UserHeader
                                user={query.data.getUser}
                            />
                            <Mutation
                                mutation={MutationUpdateUser}
                                refetchQueries={[]}
                            >
                                {updateUser => (
                                    <ProfilePage
                                        auth={auth}
                                        notification={notification}
                                        query={query}
                                        updateUser={updateUser}
                                    />
                                )}
                            </Mutation>
                        </Fragment>
                    )
                ))}
            </Query>
        </Host>
    );
};

interface Props extends React.Props<{}> {
    auth: AuthValue;
    notification: NotificationValue;
    query: QueryResult<any, {
        id: any;
    }>;
    updateUser: MutationFn<any, OperationVariables>;
}

const ProfilePage = (
    {
        auth,
        notification,
        updateUser,
        query: {
            data,
            refetch
        }
    }: Props
) => {
    const user = data.getUser as User;

    const [skillList, setSkillList] = useState<string[]>(user.skillList || []);
    const [editableAvatarDialogOpend, setEditableAvatarDialogOpen] = useState<boolean>(false);
    const [uploadingAvatarImage, setUploadingAvatarImage] = useState<boolean>(false);

    const displayNameInputElement = useRef<HTMLInputElement>(null);
    const emailInputElement = useRef<HTMLInputElement>(null);
    const careerInputElement = useRef<HTMLInputElement>(null);
    const messageInputElement = useRef<HTMLInputElement>(null);

    const routerHistory = useContext(RouterHistoryContext);

    return (
        <form
            onSubmit={
                handleUpdateUserFormSubmit({
                    skillList,
                    updateUser,
                    user,
                    auth,
                    notification,
                    routerHistory,
                    displayNameInputElement,
                    emailInputElement,
                    messageInputElement,
                    careerInputElement
                })
            }
        >
            <ProfileContent>
                <ShortTextField
                    id="profile-name"
                    margin="dense"
                    label={<LocationText text="Display name"/>}
                    defaultValue={user.displayName}
                    required
                    inputRef={displayNameInputElement}
                />
                <ShortTextField
                    id="profile-email"
                    margin="dense"
                    label={<LocationText text="Mail address"/>}
                    type="email"
                    defaultValue={user.email}
                    inputRef={emailInputElement}
                />
                <TextField
                    id="profile-message"
                    label={<LocationText text="Message"/>}
                    margin="normal"
                    defaultValue={user.message}
                    inputRef={messageInputElement}
                />
                <TextField
                    id="profile-career"
                    label={<LocationText text="Career"/>}
                    margin="normal"
                    defaultValue={user.career}
                    multiline
                    rows={4}
                    inputRef={careerInputElement}
                />
                <div>
                    <LocalizationContext.Consumer>
                        {({ locationText }) => (
                            <TextField
                                label={<LocationText text="Skill"/>}
                                placeholder={locationText["Input skill"]}
                                onKeyPress={tagInputKeyPress({ skillList, setSkillList })}
                                margin="normal"
                                inputProps={{
                                    maxLength: 10,
                                }}
                            />
                        )}
                    </LocalizationContext.Consumer>
                    <ChipList>
                        {skillList.map(skill =>
                            <Chip
                                key={skill}
                                clickable={false}
                                label={skill}
                                onDelete={() => setSkillList(skillList.filter(x => x !== skill))}
                            />
                        )}
                    </ChipList>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => routerHistory.history.push(`/users/${user.id}`)}
                    >
                        <LocationText text="Cancel"/>
                    </Button>
                    <Button
                        type="submit"
                        component="button"
                        variant="contained"
                        color="primary"
                    >
                        <LocationText text="Save"/>
                    </Button>
                </div>
            </ProfileContent>
            <Dialog
                open={editableAvatarDialogOpend}
                onClose={() => setEditableAvatarDialogOpen(false)}
                aria-labelledby="editable-avatar-dialog-title"
            >
                <form
                    onSubmit={
                        handleUpdateAvatarFormSubmit({
                            updateUser,
                            refetch,
                            auth,
                            notification,
                            setEditableAvatarDialogOpen,
                            setUploadingAvatarImage
                        })
                    }
                >
                    <DialogTitle
                        id="editable-avatar-dialog-title"
                    >
                        <LocationText text="Upload avatar"/>
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
                            onClick={() => setEditableAvatarDialogOpen(false)}
                        >
                            <LocationText text="Cancel"/>
                        </Button>
                        <Button
                            component="button"
                            color="primary"
                            type="submit"
                        >
                            <LocationText text="Submit"/>
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </form>
    );
};

const handleUpdateUserFormSubmit = (
    {
        skillList,
        updateUser,
        user,
        auth,
        notification,
        routerHistory,
        displayNameInputElement,
        emailInputElement,
        messageInputElement,
        careerInputElement
    }: {
        skillList: string[],
        updateUser: MutationFn<any, OperationVariables>,
        user: User
        auth: AuthValue,
        notification: NotificationValue,
        routerHistory: RouterHistoryValue,
        displayNameInputElement: React.RefObject<HTMLInputElement>,
        emailInputElement: React.RefObject<HTMLInputElement>,
        messageInputElement: React.RefObject<HTMLInputElement>,
        careerInputElement: React.RefObject<HTMLInputElement>,
    }
) => async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.token) return;

    if (!(displayNameInputElement.current && emailInputElement.current && messageInputElement.current && careerInputElement.current)) return;

    await updateUser({
        variables: {
            user: {
                skillList,
                id: auth.token!.payload.sub,
                displayName: displayNameInputElement.current!.value,
                email: emailInputElement.current!.value,
                message: messageInputElement.current!.value,
                career: careerInputElement.current!.value
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
                __typename: "User"
            }
        },
    });

    notification.notification("info", "Update Profile!");
    routerHistory.history.push(`/users/${user.id}`);
};

const tagInputKeyPress = (
    {
        skillList,
        setSkillList
    }: {
        skillList: string[],
        setSkillList: React.Dispatch<React.SetStateAction<string[]>>,
    }
) => (e: React.KeyboardEvent) => {
    if (skillList.length >= 5)
        return;

    const inputValue = (e.target as any).value;
    if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
        e.preventDefault();
        if (inputValue.length > 1) {
            if (!skillList.some(x => x === inputValue))
                setSkillList(skillList.concat((e.target as any).value));

            (e.target as any).value = "";
        }
    }
};

const handleUpdateAvatarFormSubmit = (
    {
        updateUser,
        refetch,
        auth,
        notification,
        setUploadingAvatarImage,
        setEditableAvatarDialogOpen
    }: {
        updateUser: MutationFn<any, OperationVariables>,
        refetch: (variables?: { id: any; } | undefined) => Promise<ApolloQueryResult<any>>,
        auth: AuthValue,
        notification: NotificationValue,
        setUploadingAvatarImage: React.Dispatch<React.SetStateAction<boolean>>,
        setEditableAvatarDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    }
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
        setEditableAvatarDialogOpen(false);
    } catch (error) {
        setUploadingAvatarImage(false);
        notification.notification("error", error.message);
        console.error(error);
    }
};
