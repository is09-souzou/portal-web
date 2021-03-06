import {
    Button,
    Chip,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField
} from "@material-ui/core";
import { ApolloError } from "apollo-client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Mutation, MutationFn, OperationVariables } from "react-apollo";
import createSignedUrl from "src/api/createSignedUrl";
import fileUploadToS3 from "src/api/fileUploadToS3";
import FlexibleSpace from "src/components/atoms/FlexibleSpace";
import LocationText from "src/components/atoms/LocationText";
import Page from "src/components/atoms/Page";
import PortalMarkdown from "src/components/atoms/PortalMarkdown";
import Header from "src/components/molecules/Header";
import MarkdownHintDialog from "src/components/organisms/MarkdownHintDialog";
import MarkdownSupports from "src/components/organisms/MarkdownSupports";
import WorkDialog from "src/components/organisms/WorkDialog";
import ActionArea from "src/components/pages/WorkPostPage/ActionArea";
import ActionButtonWrapper from "src/components/pages/WorkPostPage/ActionButtonWrapper";
import ChipList from "src/components/pages/WorkPostPage/ChipList";
import Head from "src/components/pages/WorkPostPage/Head";
import Host from "src/components/pages/WorkPostPage/Host";
import MainImageInput from "src/components/pages/WorkPostPage/MainImageInput";
import WorkContentArea from "src/components/pages/WorkPostPage/WorkContentArea";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import { Work } from "src/graphQL/type";

const MutationCreateWork = gql(`
    mutation createWork(
        $work: WorkCreate!
    ) {
        createWork(
            work: $work
        ) {
            id
            description
            imageUrl
            userId
            title
            tags
            isPublic
            createdAt
        }
    }
`);

export default (props: React.Props<{}>) => {
    const auth = useContext(AuthContext);
    const routerHistory = useContext(RouterHistoryContext);
    if (!auth.token) {
        routerHistory.history.push("/?sign-up=true");
        return null;
    }

    return (
        <Page
            {...props}
            ref={props.ref as any}
        >
            <Header
                title={<LocationText text="Work post"/>}
            />
            <Mutation mutation={MutationCreateWork} refetchQueries={[]}>
                {(createWork, { error: createWorkError }) => (
                    <WorkPostPage
                        auth={auth}
                        createWork={createWork}
                        createWorkError={createWorkError}
                    />
                )}
            </Mutation>
        </Page>
    );
};

const WorkPostPage = (
    {
        auth,
        createWork,
        createWorkError
    }: {
        auth: AuthValue,
        createWork: MutationFn<any, OperationVariables>,
        createWorkError: ApolloError | undefined
    }
) => {

    const [tags, setTags] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");
    const [previewWork, setPreviewWork] = useState<Work | undefined>(undefined);
    const [workDialogOpend, setWorkDialogOpen] = useState<boolean>(false);
    const [hintDialogOpend, setHintDialogOpen] = useState<boolean>(false);
    const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(undefined);
    const [isPublic, setPublic] = useState<boolean>(true);
    const [isUpdatedByMarkdownSupport, setUpdatedByMarkdownSupport] = useState<boolean>(false);
    const [adjustLine, setAdjustLine] = useState<[number, number]>([0, 0]);

    const descriptionTextAreaElement = useRef<HTMLTextAreaElement>(null);
    const titleInputElement = useRef<HTMLInputElement>(null);

    const notification = useContext(NotificationContext);
    const localization = useContext(LocalizationContext);

    useEffect(
        () => {
            if (descriptionTextAreaElement.current && isUpdatedByMarkdownSupport) {
                descriptionTextAreaElement.current!.setSelectionRange(adjustLine[0], adjustLine[1]);
                setUpdatedByMarkdownSupport(false);
            }
        },
        [description]
    );

    return (
        <Host
            onSubmit={
                handleHostSubmit({
                    createWork,
                    auth,
                    notification,
                    titleInputElement,
                    tags,
                    description,
                    isPublic,
                    imageUrl: mainImageUrl
                })}
        >
            <div>
                <Head>
                    <TextField
                        id="title"
                        label={<LocationText text="Title"/>}
                        placeholder={localization.locationText["Input title"]}
                        inputRef={titleInputElement}
                        margin="normal"
                        fullWidth
                        required
                    />
                    <div>
                        <TextField
                            label={<LocationText text="Tags"/>}
                            placeholder={localization.locationText["Input tags"]}
                            onKeyPress={tagInputKeyPress({ tags, setTags })}
                            margin="normal"
                            inputProps={{
                                maxLength: 10
                            }}
                        />
                        <ChipList>
                            {tags.map(tag => (
                                <Chip
                                    key={tag}
                                    clickable={false}
                                    label={tag}
                                    onDelete={() => setTags(tags.filter(x => tag !== x))}
                                />
                            ))}
                        </ChipList>
                    </div>
                </Head>
                <WorkContentArea>
                    <div>
                        <MainImageInput
                            labelText={localization.locationText["Image"]}
                            onChange={submitMainImage({ auth, notification, setMainImageUrl })}
                        />
                        <div>
                            <TextField
                                label={<LocationText text="Description"/>}
                                multiline
                                margin="normal"
                                required
                                placeholder={localization.locationText["Input description"]}
                                rowsMax={30}
                                fullWidth
                                inputRef={descriptionTextAreaElement}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <MarkdownSupports
                                element={descriptionTextAreaElement}
                                onChangeValue={handleMarkdownSupportsChangeValue({ setAdjustLine, setDescription, setUpdatedByMarkdownSupport })}
                            />
                        </div>
                    </div>
                    <PortalMarkdown
                        source={description}
                        rawSourcePos
                    />
                </WorkContentArea>
                <ActionArea>
                    <FlexibleSpace/>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={() => setPublic(!isPublic)}
                                    color="primary"
                                    checked={isPublic}
                                />
                            }
                            label={<LocationText text="Publish"/>}
                            labelPlacement="start"
                        />
                    </FormGroup>
                    <ActionButtonWrapper>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setHintDialogOpen(true)}
                        >
                            <LocationText text="Hint"/>
                        </Button>
                        <FlexibleSpace/>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handlePreviewWork({
                                auth,
                                setPreviewWork,
                                setWorkDialogOpen,
                                tags,
                                description,
                                isPublic,
                                titleInputElement,
                                imageUrl: mainImageUrl
                            })}
                        >
                            <LocationText text="Preview"/>
                        </Button>
                        <Button
                            type="submit"
                            component="button"
                            variant="contained"
                            color="primary"
                        >
                            <LocationText text="Create"/>
                        </Button>
                    </ActionButtonWrapper>
                </ActionArea>
            </div>
            <WorkDialog
                editable={true}
                open={workDialogOpend}
                onClose={() => {
                    setPreviewWork(undefined);
                    setWorkDialogOpen(false);
                }}
                work={previewWork}
                userId={auth.token!.payload.sub}
            />
            <MarkdownHintDialog
                open={hintDialogOpend}
                onClose={() => setHintDialogOpen(false)}
            />
            {createWorkError && <notification.ErrorComponent message={createWorkError.message}/>}
        </Host>
    );
};

export const tagInputKeyPress = (
    {
        tags,
        setTags,
    }: {
        tags: string[],
        setTags: React.Dispatch<React.SetStateAction<string[]>>,
    }
) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (tags.length >= 5)
        return e.preventDefault();

    const inputValue = (e.target as any).value;
    if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
        e.preventDefault();
        if (inputValue.length > 1) {
            if (!tags.some(x => x === inputValue))
                setTags(
                    tags.concat((e.target as any).value)
                );

            (e.target as any).value = "";
        }
    }
};

export const handlePreviewWork = (
    {
        auth,
        setPreviewWork,
        setWorkDialogOpen,
        titleInputElement,
        tags,
        imageUrl,
        description,
        isPublic
    }: {
        auth: AuthValue,
        setPreviewWork: React.Dispatch<React.SetStateAction<Work | undefined>>,
        setWorkDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
        titleInputElement: React.RefObject<HTMLInputElement>,
        tags: string[],
        imageUrl?: string,
        description: string,
        isPublic: boolean
    }
) => {
    setPreviewWork(
        {
            description,
            tags,
            isPublic,
            id: "preview",
            imageUrl: imageUrl || "",
            title: titleInputElement.current ? titleInputElement.current!.value : "",
            userId: (auth.token || { payload: { sub: "xxx" } }).payload.sub,
            createdAt: +new Date() / 1000,
            user: {
                id: "preview",
                email: "preview",
                displayName: "display name",
                career: "career",
                avatarUri: "/img/no-image.png",
                message: "message"
            }
        }
    );
    setWorkDialogOpen(true);
};

export const submitMainImage = (
    {
        auth,
        notification,
        setMainImageUrl
    }: {
        auth: AuthValue,
        notification: NotificationValue,
        setMainImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>
    }
) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!auth.token) {
        notification.notification("error", "Need Sign in");
        console.error(new Error("Need Sign in"));
        return;
    }

    if (!e.target.files) {
        notification.notification("error", "Required set image");
        console.error("Required set image");
        return;
    }

    const image = e.target.files![0];
    const result = await createSignedUrl({
        jwt: auth.token!.jwtToken,
        userId: auth.token!.payload.sub,
        type: "work",
        mimetype: image.type
    });
    await fileUploadToS3({
        url: result.signedUrl,
        file: image
    });
    setMainImageUrl(result.uploadedUrl);
};

const handleHostSubmit = (
    {
        createWork,
        auth,
        notification,
        titleInputElement,
        tags,
        imageUrl,
        description,
        isPublic
    }: {
        createWork: MutationFn<any, OperationVariables>,
        auth: AuthValue,
        notification: NotificationValue,
        titleInputElement: React.RefObject<HTMLInputElement>,
        tags: string[],
        imageUrl?: string,
        description: string,
        isPublic: boolean
    }
) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.token) {
        notification.notification("error", "Need Sign in");
        console.error(new Error("Need Sign in"));
        return;
    }

    if (!titleInputElement.current) {
        notification.notification("error", "Title input element is not found");
        console.error(new Error("Title input element is not found"));
        return;
    }

    if (!imageUrl) {
        notification.notification("error", "Required main image");
        console.error(new Error("Required main image"));
        return;
    }

    await new Promise<Work>(resolve => createWork({
        variables: {
            work: {
                description,
                imageUrl,
                isPublic,
                tags,
                title: titleInputElement.current!.value,
                userId: auth.token!.payload.sub
            }
        },
        optimisticResponse: {
            __typename: "Mutation",
            createWork: {
                description,
                imageUrl,
                isPublic,
                tags,
                id: "new",
                title: titleInputElement.current!.value,
                userId: auth.token!.payload.sub,
                createdAt: +new Date(),
                __typename: "Work"
            }
        },
        update: (_, { data: { createWork } }) => createWork.id !== "new" && resolve(createWork as Work)
    }));

    notification.notification("info", "Created Work!");
    window.location.replace("/");
};

export const handleMarkdownSupportsChangeValue = (
    {
        setDescription,
        setAdjustLine,
        setUpdatedByMarkdownSupport,
    }: {
        setDescription: React.Dispatch<React.SetStateAction<string>>,
        setAdjustLine: React.Dispatch<React.SetStateAction<[number, number]>>,
        setUpdatedByMarkdownSupport: React.Dispatch<React.SetStateAction<boolean>>
    }
) => (description: string, lines: [number, number]) => {
    setUpdatedByMarkdownSupport(true);
    setAdjustLine(lines);
    setDescription(description);
};
