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
import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Mutation, Query } from "react-apollo";
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

    displayNameInput?: any;
    emailInput?      : any;
    careerInput?     : any;
    messageInput?    : any;

    state = {
        chipsData                    : undefined,
        editableAvatarDialogIsVisible: false,
        uploadingAvatarImage         : false
    };

    deleteChip = (data: Chip) => () => {
        if (this.state.chipsData === undefined)
            return;

        this.setState({
            chipsData: (this.state.chipsData || [] as Chip[]).filter((x: Chip): boolean => data.key !== x.key)
        });
    }

    tagInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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

                        const currentUser = data.getUser;

                        if (this.state.chipsData === undefined)
                            this.setState({
                                chipsData: currentUser.skillList.map((x: string) => ({ key: x, label: x }))
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
                                                // tslint:disable-next-line jsx-no-lambda
                                                onSubmit={async e => {
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

                                                    notificationListener.notification("info", "Update Profile!");
                                                    history.push(("/users/") + currentUser.id);
                                                }}
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
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                onChange={(e: any) => this.displayNameInput.value = (e.target.value)}
                                                                defaultValue={currentUser.displayName}
                                                                required
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                inputRef={x => this.displayNameInput = x}
                                                            />
                                                            <TextField
                                                                id="profile-email"
                                                                margin="dense"
                                                                label={locale.profile.mailAdress}
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                onChange={(e: any) => this.emailInput.value = (e.target.value)}
                                                                type="email"
                                                                defaultValue={currentUser.email}
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                inputRef={x => this.emailInput = x}
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
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        onChange={(e: any) => this.messageInput.value = (e.target.value)}
                                                        defaultValue={currentUser.message}
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        inputRef={x => this.messageInput = x}
                                                    />
                                                    <TextField
                                                        id="profile-career"
                                                        label={locale.profile.career}
                                                        margin="normal"
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        onChange={(e: any) => this.careerInput.value = (e.target.value)}
                                                        defaultValue={currentUser.career}
                                                        multiline
                                                        rows={4}
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        inputRef={x => this.careerInput = x}
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
                                                            {(this.state.chipsData || currentUser.skillList.map((x: string) => ({ key: x, label: x })))
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
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() => history.push(("/users/") + currentUser.id)}
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
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        onSubmit={async e => {
                                                            e.preventDefault();
                                                            const image = (e.target as any).elements["newAvatarImage"].files[0];

                                                            try {
                                                                this.setState({ uploadingAvatarImage: true });
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
                                                                notificationListener.errorNotification(e);
                                                            }
                                                        }}
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
