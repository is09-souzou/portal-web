import React, { Fragment } from "react";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    LinearProgress
} from "@material-ui/core";
import gql                 from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import styled              from "styled-components";
import * as H              from "history";
import toObjectFromURIQuery          from "../../api/toObjectFromURIQuery";
import createSignedUrl               from "../../api/createSignedUrl";
import fileUploadToS3                from "../../api/fileUploadToS3";
import { PageComponentProps }        from "../../App";
import { AuthProps }                 from "../wrapper/Auth";
import { NotificationListenerProps } from "../wrapper/NotificationListener";
import ErrorPage                     from "../ErrorPage";
import GraphQLProgress               from "../GraphQLProgress";
import Header                        from "../Header";
import ImageInput                    from "../ImageInput";
import NotFound                      from "../NotFound";
import Page                          from "../Page";

type Item = "displayName" | "email" | "career" | "message" | "avatarUri";

interface State {
    whileEditingItem: Item[];
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
            skill
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
    credentialEmailInput?: any;

    componentWillMount() {
        this.setState({
            whileEditingItem: [],
            editableAvatarDialogIsVisible: false,
            uploadingAvatarImage: false,
        });
    }

    addWhileEditingItem = (item: Item) => (
        () => (
            !this.state.whileEditingItem.includes(item)
         && this.setState({ whileEditingItem: this.state.whileEditingItem.concat(item) })
        )
    )

    callUpdateUser = async (updateUser: Function, item: Item, value: any) => {
        try {
            await updateUser({
                variables: {
                    user: {
                        [item]: value,
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
            });
            this.setState({ whileEditingItem: this.state.whileEditingItem.filter(x => x !== item) });
        } catch (err) {
            this.props.notificationListener.errorNotification(err);
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
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent error={error}/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return  <NotFound />;

                        const currentUser = data.getUser;

                        return (
                            <Mutation
                                mutation={MutationUpdateUser}
                            >
                                {updateUser => (
                                    <ProfileForm>
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
                                                        margin="normal"
                                                        InputProps={{
                                                            endAdornment: (
                                                                this.state.whileEditingItem.includes("displayName")
                                                            && <Button
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                onClick={() =>
                                                                    /[a-zA-Z1-9]{3,}/.test(this.displayNameInput.value)
                                                                && this.callUpdateUser(
                                                                        updateUser,
                                                                        "displayName",
                                                                        this.displayNameInput.value
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </Button>
                                                            )
                                                        }}
                                                        onChange={this.addWhileEditingItem("displayName")}
                                                        defaultValue={currentUser.displayName}
                                                        required
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        inputRef={x => this.displayNameInput = x}
                                                    />
                                                    <TextField
                                                        id="profile-email"
                                                        margin="normal"
                                                        InputProps={{
                                                            endAdornment: (
                                                                this.state.whileEditingItem.includes("email")
                                                                && <Button
                                                                    // tslint:disable-next-line:jsx-no-lambda
                                                                    onClick={() =>
                                                                        this.callUpdateUser(
                                                                            updateUser,
                                                                            "email",
                                                                            this.emailInput.value
                                                                        )
                                                                    }
                                                                >
                                                                    Save
                                                                </Button>
                                                            )
                                                        }}
                                                        type="email"
                                                        onChange={this.addWhileEditingItem("email")}
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
                                                id="profile-career"
                                                label="Career"
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        this.state.whileEditingItem.includes("career")
                                                        && <Button
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() =>
                                                                this.callUpdateUser(
                                                                    updateUser,
                                                                    "career",
                                                                    this.careerInput.value
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                    )
                                                }}
                                                onChange={this.addWhileEditingItem("career")}
                                                defaultValue={currentUser.career}
                                                multiline
                                                rows={4}
                                                // tslint:disable-next-line:jsx-no-lambda
                                                inputRef={x => this.careerInput = x}
                                            />
                                            <TextField
                                                id="profile-message"
                                                label="Message"
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        this.state.whileEditingItem.includes("message")
                                                        && <Button
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() =>
                                                                this.callUpdateUser(
                                                                    updateUser,
                                                                    "message",
                                                                    this.messageInput.value
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                    )
                                                }}
                                                onChange={this.addWhileEditingItem("message")}
                                                defaultValue={currentUser.message}
                                                // tslint:disable-next-line:jsx-no-lambda
                                                inputRef={x => this.messageInput = x}
                                            />
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
                                                    Upload Avatar
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
                                    </ProfileForm>
                                )}
                            </Mutation>
                        );
                    }}
                </Query>
            </ProfilePageHost>
        );
    }
}

const PageHost = styled(Page)`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
    transition: all .3s ease-out;
`;

const ProfileForm = styled.form`
    > :nth-child(3) {
        display: flex;
        flex-direction: column;
    }
`;

const UserAvatar = styled(Avatar)`
    && {
        border: 1px solid #ccc;
        width: 10rem;
        height: 10rem;
        @media (max-width: 768px) {
            width: 6rem;
            height: 6rem;
        }
    }
`;

const ProfilePageHost = (
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

const ProfilePageHeader = styled.div`
    display: flex;
    flex-direction: column;
    > :first-child {
        height: 10rem;
        object-fit: cover;
    }
    > :last-child {
        display: flex;
        height: 7rem;
        align-items: center;
        margin-left: 5rem;
        > :first-child {
            margin-bottom: 3rem;
        }
        > :last-child {
            display: flex;
            flex-direction: column;
            margin-left: 2rem;
        }
        @media (max-width: 768px) {
            margin-left: 1rem;
            > :last-child {
                visibility: hidden;
            }
        }
    }
`;

const ProfileContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    width: max-content;
    margin: 1rem 0 1rem 6rem;
    @media (max-width: 768px) {
        > * {
            margin-left: 1rem;
        }
    }
`;
