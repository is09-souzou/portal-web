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
import Page from "src/components/atoms/Page";
import PortalMarkdown from "src/components/atoms/PortalMarkdown";
import Header from "src/components/molecules/Header";
import MarkdownSupports from "src/components/organisms/MarkdownSupports";
import WorkDialog from "src/components/organisms/WorkDialog";
import ActionArea from "src/components/pages/WorkPostPage/ActionArea";
import ChipList from "src/components/pages/WorkPostPage/ChipList";
import Head from "src/components/pages/WorkPostPage/Head";
import Host from "src/components/pages/WorkPostPage/Host";
import MainImageInput from "src/components/pages/WorkPostPage/MainImageInput";
import WorkContentArea from "src/components/pages/WorkPostPage/WorkContentArea";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
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
            <Header/>
                <Mutation mutation={MutationCreateWork} refetchQueries={[]}>
                    {(createWork, { error: createWorkError }) => (
                        <WorkPostPage
                            auth={auth}
                            routerHistory={routerHistory}
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
        routerHistory,
        createWork,
        createWorkError
    }: {
        auth: AuthValue,
        routerHistory: RouterHistoryValue,
        createWork: MutationFn<any, OperationVariables>,
        createWorkError: ApolloError | undefined
    }
) => {

    const [tags, setTags] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");
    const [previewWork, setPreviewWork] = useState<Work | undefined>(undefined);
    const [workDialogOpend, setWorkDialogOpen] = useState<boolean>(false);
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
                    routerHistory,
                    imageUrl: mainImageUrl
                })}
        >
            <div>
                <Head>
                    <TextField
                        id="title"
                        label={localization.locationText.works.title}
                        placeholder={localization.locationText.works.inputTitle}
                        margin="normal"
                        fullWidth
                        required
                    />
                    <div>
                        <TextField
                            label={localization.locationText.works.tags}
                            placeholder={"Input Tags!"}
                            onKeyDown={tagInputKeyDown({ tags, setTags })}
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
                            labelText={localization.locationText.works.image}
                            onChange={submitMainImage({ auth, notification, setMainImageUrl })}
                        />
                        <div>
                            <TextField
                                label={localization.locationText.works.description}
                                multiline
                                margin="normal"
                                required
                                placeholder={localization.locationText.works.inputDiscription}
                                rowsMax={30}
                                fullWidth
                                inputRef={descriptionTextAreaElement}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <MarkdownSupports
                                element={descriptionTextAreaElement.current ? descriptionTextAreaElement.current : undefined}
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
                    <div/>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={() => setPublic(!isPublic)}
                                    color="primary"
                                    checked={isPublic}
                                >
                                    Range setting
                                </Switch>
                            }
                            label={localization.locationText.works.publish}
                            labelPlacement="start"
                        />
                    </FormGroup>
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
                        {localization.locationText.works.preview}
                    </Button>
                    <Button
                        type="submit"
                        component="button"
                        variant="contained"
                        color="primary"
                    >
                        {localization.locationText.works.create}
                    </Button>
                </ActionArea>
            </div>
            <WorkDialog
                open={workDialogOpend}
                onClose={() => {
                    setPreviewWork(undefined);
                    setWorkDialogOpen(false);
                }}
                work={previewWork}
                userId={auth.token!.payload.sub}
            />
            {createWorkError && <notification.ErrorComponent message={createWorkError}/>}
        </Host>
    );
};

const tagInputKeyDown = (
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

const handlePreviewWork = (
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

const submitMainImage = (
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
        return;
    }

    if (!e.target.files) {
        notification.notification("error", "Required set image");
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
        isPublic,
        routerHistory
    }: {
        createWork: MutationFn<any, OperationVariables>,
        auth: AuthValue,
        notification: NotificationValue,
        titleInputElement: React.RefObject<HTMLInputElement>,
        tags: string[],
        imageUrl?: string,
        description: string,
        isPublic: boolean,
        routerHistory: RouterHistoryValue
    }
) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.token) {
        notification.notification("error", "Need Sign in");
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
    routerHistory.history.push("/");
};

const handleMarkdownSupportsChangeValue = (
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
