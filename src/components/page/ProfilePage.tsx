import React, { Fragment } from "react";
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    LinearProgress,
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
import { LocaleContext }             from "../wrapper/MainLayout";
import { NotificationListenerProps } from "../wrapper/NotificationListener";
import ErrorPage                     from "../ErrorPage";
import GraphQLProgress               from "../GraphQLProgress";
import Header                        from "../Header";
import ImageInput                    from "../ImageInput";
import NotFound                      from "../NotFound";
import Page                          from "../Page";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData: Chip[];
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
<<<<<<< HEAD
    credentialEmailInput?: any;

    componentWillMount() {
        this.setState({
            whileEditingItem: [],
            editableAvatarDialogIsVisible: false,
            uploadingAvatarImage: false,
        });
    }
=======
>>>>>>> fix(ProfilePage.tsx): change to bluk update

    state = {
        chipsData: [] as Chip[],
        editableAvatarDialogIsVisible: false,
        uploadingAvatarImage: false
    };

    deleteChip = (data: Chip) => () => this.setState({
        chipsData: this.state.chipsData.filter((x: Chip): boolean => data.key !== x.key)
    })

    tagInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.state.chipsData.length >= 5)
            return e.preventDefault();

        const inputValue = (e.target as any).value;
        if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
            e.preventDefault();
            if (inputValue.length > 1) {
                if (!this.state.chipsData.some(x => x.label === inputValue))
                    this.setState({
                        chipsData: this.state.chipsData.concat({
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
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent error={error}/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return  <NotFound />;

                        const currentUser = data.getUser;

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
                                                            skillList: this.state.chipsData.map(x => x.label),
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
                                                            skillList: this.state.chipsData.map(x => x.label),
                                                            __typename: "User"
                                                        }
                                                    },
                                                });
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
                                                            margin="normal"
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onChange={(e: any) => this.displayNameInput.value = (e.target.value)}
                                                            defaultValue={currentUser.displayName}
                                                            required
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            inputRef={x => this.displayNameInput = x}
                                                        />
                                                        <TextField
                                                            id="profile-email"
                                                            margin="normal"
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onChange={(e: any) => this.emailInput.value = (e.target.value)}
                                                            type="email"
                                                            defaultValue={currentUser.email}
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            inputRef={x => this.emailInput = x}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Button
                                                            type="outlined"
                                                            color="primary"
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() => history.push(("/users/") + currentUser.id)}
                                                        >
                                                            cancel
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            component="button"
                                                            variant="raised"
                                                            color="primary"
                                                        >
                                                            save
                                                        </Button>
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
                                                        label={locale.works.tags}
                                                        placeholder={"Input Tags!"}
                                                        onKeyDown={this.tagInputKeyDown}
                                                        margin="normal"
                                                        inputProps={{
                                                            maxLength: 10,
                                                        }}
                                                    />
                                                    <ChipList>
                                                        {this.state.chipsData.map(data =>
                                                            <Chip
                                                                key={data.key}
                                                                clickable={false}
                                                                label={data.label}
                                                                onDelete={this.deleteChip(data)}
                                                            />
                                                        )}
                                                    </ChipList>
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

const PageHost = styled(Page)`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
    transition: all .3s ease-out;
`;

const ChipList = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: flex-end;
    padding-bottom: .5rem;
    flex-grow: 1;
    > :nth-child(n + 1) {
        margin-left: .5rem;
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
        > :nth-child(2) {
            display: flex;
            flex-direction: column;
            margin-left: 2rem;
        }
        > :last-child {
            display; flex;
            max-width: max-content;
        }
    }
`;

const ProfileContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    margin: 1rem 6rem 1rem 6rem;
    > :last-child {
        display: flex;
    }
    @media (max-width: 768px) {
        > * {
            margin-left: 1rem;
        }
    }
`;
