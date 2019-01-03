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
import React, { Fragment } from "react";
import { Mutation,  MutationFn, OperationVariables, Query } from "react-apollo";
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
import { LocaleContext } from "src/components/wrappers/MainLayout";
import { User } from "src/graphQL/type";
import { PageComponentProps } from "src/App";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData?: Chip[];
    editableAvatarDialogIsVisible: boolean;
    uploadingAvatarImage: boolean;
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

export default class extends React.Component<PageComponentProps<{}>, State> {

    state: State = {
        chipsData                    : undefined,
        editableAvatarDialogIsVisible: false,
        uploadingAvatarImage         : false
    };

    displayNameInput?: any;
    emailInput?      : any;
    careerInput?     : any;
    messageInput?    : any;

    setDisplayNameInput = (x: any) => this.displayNameInput = x;
    setEmailInput = (x: any) => this.emailInput = x;
    setCareerInput = (x: any) => this.careerInput = x;
    setMessageInput = (x: any) => this.messageInput = x;

    handleUpdateUserFormSubmit = (
        updateUser: MutationFn<any, OperationVariables>,
        currentUser: User
    ) => async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser({
            variables: {
                user: {
                    id: this.props.auth.token!.payload.sub,
                    displayName: this.displayNameInput.value,
                    email: this.emailInput.value,
                    message: this.messageInput.value,
                    career: this.careerInput.value,
                    skillList: (this.state.chipsData || [] as Chip[]).map(x => x.label) as string[],
                }
            },
            optimisticResponse: {
                __typename: "Mutation",
                updateUser: {
                    id: this.props.auth.token!.payload.sub,
                    displayName: this.displayNameInput.value,
                    email: this.emailInput.value,
                    message: this.messageInput.value,
                    career: this.careerInput.value,
                    skillList: (this.state.chipsData || [] as Chip[]).map(x => x.label) as string[],
                    __typename: "User"
                }
            },
        });

        this.props.notificationListener.notification("info", "Update Profile!");
        this.props.history.push(("/users/") + currentUser.id);
    }

    handleUpdateAvatarFormSubmit = (
        updateUser: MutationFn<any, OperationVariables>,
        refetch: (variables?: { id: any; } | undefined) => Promise<ApolloQueryResult<any>>
    ) => async (e: React.FormEvent) => {
        e.preventDefault();

        if (!this.props.auth.token) return;

        const image = (e.target as any).elements["newAvatarImage"].files[0];

        try {
            this.setState({ uploadingAvatarImage: true });
            const {
                signedUrl,
                uploadedUrl
            } = await createSignedUrl({
                jwt: this.props.auth.token!.jwtToken,
                userId: this.props.auth.token!.payload.sub,
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
                            id: this.props.auth.token!.payload.sub,
                        }
                    },
                    optimisticResponse: {
                        __typename: "Mutation",
                        updateUser: {
                            id: this.props.auth.token!.payload.sub,
                            __typename: "User"
                        }
                    },
                })
            ]);

            refetch();
            this.setState({ uploadingAvatarImage: false });
            this.closeEditableAvatarDialog();
        } catch (e) {
            this.setState({ uploadingAvatarImage: false });
            this.props.notificationListener.errorNotification(e);
        }
    }

    deleteChip = (data: Chip) => () => {
        if (this.state.chipsData === undefined)
            return;

        this.setState({
            chipsData: (this.state.chipsData || [] as Chip[]).filter((x: Chip): boolean => data.key !== x.key)
        });
    }

    tagInputKeyDown = (e: React.KeyboardEvent) => {
        if (this.state.chipsData === undefined)
            return;

        if ((this.state.chipsData || [] as Chip[]).length >= 5)
            return e.preventDefault();

        const inputValue = (e.target as any).value;
        if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
            e.preventDefault();
            if (inputValue.length > 1) {
                if (!(this.state.chipsData || [] as Chip[]).some(x => x.label === inputValue))
                    this.setState({
                        chipsData: (this.state.chipsData || [] as Chip[]).concat({
                            key: (e.target as any).value,
                            label: (e.target as any).value
                        })
                    });

                (e.target as any).value = "";
            }
        }
    }

    openEditableAvatarDialog = () => this.setState({ editableAvatarDialogIsVisible: true });

    closeEditableAvatarDialog = () => this.setState({ editableAvatarDialogIsVisible: false });

    moveUserPage = (id: string) => (_: React.MouseEvent) => this.props.history.push(`/users/${id}`);

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
                <ProfilePageHost
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                >
                    <NotFound/>
                </ProfilePageHost>
            );
        }

        return (
            <ProfilePageHost
                auth={auth}
                history={history}
                notificationListener={notificationListener}
            >
                <Query
                    query={QueryGetUser}
                    variables={{ id: auth.token!.payload.sub }}
                    fetchPolicy="network-only"
                >
                    {({ loading, error, data, refetch }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            console.error(error);
                            return (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notificationListener.ErrorComponent error={error}/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return  <NotFound />;

                        const currentUser = data.getUser as User;

                        if (this.state.chipsData === undefined)
                            this.setState({
                                chipsData: (currentUser.skillList || []).map((x: string) => ({ key: x, label: x }))
                            });

                        return (
                            <LocaleContext.Consumer>
                                {({ locale }) => (
                                    <Mutation
                                        mutation={MutationUpdateUser}
                                        refetchQueries={[]}
                                    >
                                        {updateUser => (
                                            <form
                                                onSubmit={this.handleUpdateUserFormSubmit(updateUser, currentUser)}
                                            >
                                                <ProfilePageHeader>
                                                    <img
                                                        src={currentUser.avatarUri}
                                                    />
                                                    <div>
                                                        <UserAvatar
                                                            src={currentUser.avatarUri}
                                                            onClick={this.openEditableAvatarDialog}
                                                        />
                                                        <div>
                                                            <TextField
                                                                id="profile-name"
                                                                margin="dense"
                                                                label={locale.profile.displayName}
                                                                defaultValue={currentUser.displayName}
                                                                required
                                                                inputRef={this.setDisplayNameInput}
                                                            />
                                                            <TextField
                                                                id="profile-email"
                                                                margin="dense"
                                                                label={locale.profile.mailAdress}
                                                                type="email"
                                                                defaultValue={currentUser.email}
                                                                inputRef={this.setEmailInput}
                                                            />
                                                        </div>
                                                    </div>
                                                </ProfilePageHeader>
                                                <Divider />
                                                <ProfileContent>
                                                    <TextField
                                                        id="profile-message"
                                                        label={locale.profile.message}
                                                        margin="normal"
                                                        defaultValue={currentUser.message}
                                                        inputRef={this.setMessageInput}
                                                    />
                                                    <TextField
                                                        id="profile-career"
                                                        label={locale.profile.career}
                                                        margin="normal"
                                                        defaultValue={currentUser.career}
                                                        multiline
                                                        rows={4}
                                                        inputRef={this.setCareerInput}
                                                    />
                                                    <div>
                                                        <TextField
                                                            label={locale.profile.skill}
                                                            placeholder={locale.profile.inputSkill}
                                                            onKeyDown={this.tagInputKeyDown}
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
                                                                        onDelete={this.deleteChip(data)}
                                                                    />
                                                                )
                                                            }
                                                        </ChipList>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={this.moveUserPage(currentUser.id)}
                                                        >
                                                            {locale.profile.cancel}
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            component="button"
                                                            variant="raised"
                                                            color="primary"
                                                        >
                                                            {locale.profile.save}
                                                        </Button>
                                                    </div>
                                                </ProfileContent>
                                                <Dialog
                                                    open={this.state.editableAvatarDialogIsVisible}
                                                    onClose={this.closeEditableAvatarDialog}
                                                    aria-labelledby="editable-avatar-dialog-title"
                                                >
                                                    <form
                                                        onSubmit={this.handleUpdateAvatarFormSubmit(updateUser, refetch)}
                                                    >
                                                        <DialogTitle
                                                            id="editable-avatar-dialog-title"
                                                        >
                                                            {locale.profile.dialog.title}
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <ImageInput
                                                                name="newAvatarImage"
                                                                width="256"
                                                                height="256"
                                                            />
                                                        </DialogContent>
                                                        {this.state.uploadingAvatarImage && <LinearProgress/>}
                                                        <DialogActions>
                                                            <Button
                                                                onClick={this.closeEditableAvatarDialog}
                                                            >
                                                                {locale.profile.dialog.cancel}
                                                            </Button>
                                                            <Button
                                                                component="button"
                                                                color="primary"
                                                                type="submit"
                                                            >
                                                                {locale.profile.dialog.submit}
                                                            </Button>
                                                        </DialogActions>
                                                    </form>
                                                </Dialog>
                                            </form>
                                        )}
                                    </Mutation>
                                )}
                            </LocaleContext.Consumer>
                        );
                    }}
                </Query>
            </ProfilePageHost>
        );
    }
}
