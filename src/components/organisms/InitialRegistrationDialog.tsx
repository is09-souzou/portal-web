import {
    Button,
    DialogActions,
    DialogTitle,
    LinearProgress
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Slide, { SlideProps } from "@material-ui/core/Slide";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { Mutation, MutationFn, MutationUpdaterFn, OperationVariables } from "react-apollo";
import createSignedUrl from "src/api/createSignedUrl";
import fileUploadToS3 from "src/api/fileUploadToS3";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import ImageInput from "src/components/atoms/ImageInput";
import LocationText from "src/components/atoms/LocationText";
import AuthContext from "src/contexts/AuthContext";
import NotificationContext from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import styled from "styled-components";

interface Props {}

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

export default (props: Props) => {

    const [isProcessing, setProcessing] = useState<boolean>(false);

    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);
    const routerHistory = useContext(RouterHistoryContext);

    const queryParam = toObjectFromURIQuery(routerHistory.history.location.search);
    const initialRegistrationDialogVisible = queryParam ? queryParam["initial-registration"] === "true"
                                           :               false;

    const handleFormSubmit = (createUser: MutationFn<any, OperationVariables>) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!auth.token)
            return;

        const target = e.target as any;

        try {
            const image = target.elements["avatar-image"].files[0];

            setProcessing(true);

            let signedUrl;
            let uploadedUrl;

            if (image) {
                const result = await createSignedUrl({
                    jwt: auth.token!.jwtToken,
                    mimetype: image.type,
                    type: "profile",
                    userId: auth.token!.payload.sub
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
                    optimisticResponse: {
                        __typename: "Mutation",
                        createUser: {
                            career,
                            displayName,
                            email,
                            message: "",
                            avatarUri: uploadedUrl ? uploadedUrl : "",
                            id: auth.token!.payload.sub,
                            __typename: "User"
                        }
                    },
                    variables: {
                        user: {
                            ...(uploadedUrl ? { avatarUri: uploadedUrl } : {}),
                            ...variables
                        }
                    }
                })
            ]);
            routerHistory.history.push("/?initial-registration=false");
        } catch (error) {
            notification.notification("error", error.message);
            console.error(error);
        }
        setProcessing(false);
    };

    const mutationUpdater: MutationUpdaterFn<any> = (cache, { data }) => {
        cache.writeQuery({
            data: {
                getUser: data.createUser
            },
            query: QueryGetUser,
            variables: { id: data.createUser.id }
        });
    };

    return (
        <Dialog
            open={initialRegistrationDialogVisible}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            {...props}
        >
            <Mutation
                mutation={MutationCreateUser}
                update={mutationUpdater}
            >
                {createUser => (
                    <form
                        onSubmit={handleFormSubmit(createUser)}
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            <LocationText text="Initial registration profile"/>
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
                                        label={<LocationText text="Display name"/>}
                                        margin="normal"
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        id="initial-registration-dialog-email"
                                        label={<LocationText text="Public mail address"/>}
                                        margin="normal"
                                        fullWidth
                                        type="email"
                                    />
                                </div>
                            </div>
                            <CareerTextField
                                id="initial-registration-dialog-career"
                                label={<LocationText text="Career"/>}
                                margin="normal"
                                fullWidth
                                multiline
                            />
                        </StyledDialogContent>
                        {isProcessing && <LinearProgress/>}
                        <DialogActions>
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
};

const Transition = (props: SlideProps) =>  <Slide direction="up" {...props}/>;

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        display: flex;
        flex-direction: column;
        > :nth-child(1) {
            display: flex;
            flex-direction: row;
            > :nth-child(2) {
                flex-grow: 1;
                margin: 0 2rem 2rem;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                width: 16rem;
            }
        }
        @media (max-width: 767px) {
            > :nth-child(1) {
                flex-direction: column;
                > :nth-child(2) {
                    margin: 0;
                    width: initial;
                }
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
