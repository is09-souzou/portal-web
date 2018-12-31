import React                                 from "react";
import {
    Button,
    DialogActions,
    DialogTitle,
    LinearProgress
}                                            from "@material-ui/core";
import Dialog, { DialogProps }               from "@material-ui/core/Dialog";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Slide, { SlideProps }                 from "@material-ui/core/Slide";
import TextField, { TextFieldProps }         from "@material-ui/core/TextField";
import gql                                   from "graphql-tag";
import { Mutation }                          from "react-apollo";
import styled                                from "styled-components";
import createSignedUrl                       from "src/api/createSignedUrl";
import fileUploadToS3                        from "src/api/fileUploadToS3";
import ImageInput                            from "src/components/atoms/ImageInput";
import { Token }                             from "src/components/wrappers/Auth";
import { NotificationListenerProps }         from "src/components/wrappers/NotificationListener";

interface Props extends DialogProps, NotificationListenerProps {
    token: Token;
    onClose?: () => void;
}

interface State {
    activeStep: number;
    isProcessing: boolean;
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
        }
    }
`);

const MutationCreateUser = gql(`
    mutation createUser(
        $user: UserCreate!
    ) {
        createUser(
            user: $user
        ) {
            avatarUri
            career
            displayName
            email
            id
            message
        }
    }
`);

export default class extends React.Component<Props, State> {

    handleStep = (x: number) => () => this.setState({ activeStep: x });

    componentWillMount() {
        this.setState({
            activeStep: 0,
            isProcessing: false
        });
    }

    render () {
        const {
            token,
            onClose,
            notificationListener,
            ...props
        } = this.props;

        return (
            <Dialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                {...props}
            >
                <Mutation
                    mutation={MutationCreateUser}
                    // tslint:disable-next-line:jsx-no-lambda
                    update={(cache, { data }) =>
                        cache.writeQuery({
                            data: {
                                getUser: data.createUser
                            },
                            query: QueryGetUser,
                            variables: { id: data.createUser.id }
                        })
                    }
                >
                    {createUser => (
                        <form
                            // tslint:disable-next-line:jsx-no-lambda
                            onSubmit={async e => {
                                e.preventDefault();
                                const target = e.target as any;

                                try {
                                    const image = target.elements["avatar-image"].files[0];

                                    this.setState({ isProcessing: true });

                                    let signedUrl;
                                    let uploadedUrl;

                                    if (image) {
                                        const result = await createSignedUrl({
                                            jwt: token.jwtToken,
                                            userId: token.payload.sub,
                                            type: "profile",
                                            mimetype: image.type
                                        });
                                        signedUrl = result.signedUrl;
                                        uploadedUrl = result.uploadedUrl;
                                    }

                                    const displayName = target.elements["initial-registration-dialog-display-name"].value;
                                    const email       = target.elements["initial-registration-dialog-email"].value;
                                    const career      = target.elements["initial-registration-dialog-career"].value;

                                    let variables = {};
                                    if (displayName)
                                        variables = { ...variables, displayName };
                                    if (email)
                                        variables = { ...variables, email };
                                    if (career)
                                        variables = { ...variables, career };

                                    await Promise.all([
                                        signedUrl ? fileUploadToS3({
                                            url: signedUrl,
                                            file: image
                                        }) : new Promise(x => x()),
                                        createUser({
                                            variables: {
                                                user: {
                                                    ...(uploadedUrl ? { avatarUri: uploadedUrl } : {}),
                                                    ...variables
                                                }
                                            },
                                            optimisticResponse: {
                                                __typename: "Mutation",
                                                createUser: {
                                                    email,
                                                    displayName,
                                                    career,
                                                    message: "",
                                                    avatarUri: uploadedUrl ? uploadedUrl : "",
                                                    id: token!.payload.sub,
                                                    __typename: "User"
                                                }
                                            },
                                        })
                                    ]);
                                    onClose && onClose();
                                } catch (error) {
                                    console.error(error);
                                    notificationListener.errorNotification(error);
                                }
                                this.setState({ isProcessing: false });
                            }}
                        >
                            <DialogTitle id="alert-dialog-slide-title">
                                Initial Registration Profile
                            </DialogTitle>
                            <StyledDialogContent>
                                <div>
                                    <AvatarInput
                                        name="avatar-image"
                                        width="192"
                                        height="192"
                                    />
                                    <div>
                                        <TextField
                                            id="initial-registration-dialog-display-name"
                                            label="Display Name"
                                            margin="normal"
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            id="initial-registration-dialog-email"
                                            label="Public Mail Address"
                                            margin="normal"
                                            fullWidth
                                            type="email"
                                        />
                                    </div>
                                </div>
                                <CareerTextField
                                    id="initial-registration-dialog-career"
                                    label="Career"
                                    margin="normal"
                                    fullWidth
                                    multiline
                                />
                            </StyledDialogContent>
                            {this.state.isProcessing && <LinearProgress/>}
                            <DialogActions>
                                <Button
                                    onClick={onClose}
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
                    )}
                </Mutation>
            </Dialog>
        );
    }
}

const Transition = (props: SlideProps) =>  <Slide direction="up" {...props} />;

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
        > :nth-child(1) {
            display: flex;
            > :nth-child(2) {
                flex-grow: 1;
                margin: 0 2rem 2rem;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                width: 16rem;
            }
        }
    }
`;

const AvatarInput = styled(ImageInput)`
    border-radius: 50%;
    overflow: hidden;
`;

const StyledTextField = styled(TextField as React.SFC<TextFieldProps>)`
    && {
        min-height: 4rem;
    }
`;

const CareerTextField = ({
    ...props
}) => (
    <StyledTextField
        defaultValue=""
        classes={undefined}
        className={undefined}
        style={undefined}
        onChange={undefined}
        innerRef={undefined}
        value={undefined}
        variant={undefined}
        inputProps={undefined}
        InputProps={undefined}
        inputRef={undefined}
        rows={undefined}
        rowsMax={undefined}
        {...props}
    />
);
