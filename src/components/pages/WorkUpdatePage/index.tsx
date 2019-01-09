import { Button, Chip, FormControlLabel, FormGroup, Switch, TextField } from "@material-ui/core";
import { ApolloError } from "apollo-client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useRef, useState, Fragment } from "react";
import { Mutation, MutationFn, OperationVariables, Query, QueryResult } from "react-apollo";
import createSignedUrl from "src/api/createSignedUrl";
import fileUploadToS3 from "src/api/fileUploadToS3";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Page from "src/components/atoms/Page";
import PortalMarkdown from "src/components/atoms/PortalMarkdown";
import Header from "src/components/molecules/Header";
import ImageInputDialog from "src/components/molecules/ImageInputDialog";
import NotFound from "src/components/molecules/NotFound";
import MarkdownSupports from "src/components/organisms/MarkdownSupports";
import WorkDialog from "src/components/organisms/WorkDialog";
import ActionArea from "src/components/pages/WorkPostPage/ActionArea";
import ChipList from "src/components/pages/WorkPostPage/ChipList";
import Head from "src/components/pages/WorkPostPage/Head";
import Host from "src/components/pages/WorkPostPage/Host";
import WorkContentArea from "src/components/pages/WorkPostPage/WorkContentArea";
import WorkImage from "src/components/pages/WorkUpdatePage/WorkImage";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { Work } from "src/graphQL/type";

const QueryGetWorkById = gql(`
    query($id: ID!) {
        getWork(id: $id) {
            id
	        userId
	        tags
	        createdAt
	        title
	        imageUrl
	        description
        }
    }
`);

const MutationUpdateWork = gql(`
    mutation updateWork(
        $work: WorkUpdate!
    ) {
        updateWork(
            work: $work
        ) {
            id
            description
            imageUrl
            userId
            title
            tags
            createdAt
        }
    }
`);

export default (props: React.Props<{}>) => {
    const routerHistory = useContext(RouterHistoryContext);
    const notification = useContext(NotificationContext);

    const urlMatch = routerHistory.location.pathname.match(/\/works\/update-work\/(.*)/);
    if (urlMatch)
        return (<NotFound/>);

    const workId = urlMatch![1];

    return (
        <Page
            {...props}
            ref={props.ref as any}
        >
            <Header/>
            <Query
                query={QueryGetWorkById}
                variables={{ id: workId }}
                fetchPolicy="cache-and-network"
            >
                {query => (
                    query.loading                       ? <GraphQLProgress/>
                  : query.error                         ? (
                        <Fragment>
                            <ErrorTemplate/>
                            <notification.ErrorComponent error={query.error}/>
                        </Fragment>
                    )
                  : !(query.data && query.data.getWork) ? <NotFound/>
                  :                                       (
                        <Mutation mutation={MutationUpdateWork} refetchQueries={[]}>
                            {(updateWork, { error: updateWorkError }) => (
                                <WorkUpdatePage
                                    workId={workId}
                                    query={query}
                                    updateWork={updateWork}
                                    updateWorkError={updateWorkError}
                                    routerHistory={routerHistory}
                                    notification={notification}
                                />
                            )}
                        </Mutation>
                    )
                )}
            </Query>
        </Page>
    );
};

const WorkUpdatePage = (
    {
        workId,
        query: {
            data
        },
        updateWork,
        updateWorkError,
        routerHistory,
        notification
    }: {
        workId: string,
        query: QueryResult<any, {
            id: any;
        }>,
        updateWork: MutationFn<any, OperationVariables>,
        updateWorkError: ApolloError | undefined,
        routerHistory: RouterHistoryValue,
        notification: NotificationValue
    }
) => {

    const currentWork = data.getWork as Work;

    const [previewWork, setPreviewWork] = useState<Work | undefined>(undefined);
    const [workDialogOpend, setWorkDialogOpen] = useState<boolean>(false);
    const [imageInputDialogOpend, setImageInputDialogOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>(currentWork.tags);
    const [description, setDescription] = useState<string>(currentWork.description);
    const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(currentWork.imageUrl);
    const [isPublic, setPublic] = useState<boolean>(currentWork.isPublic);
    const [isUpdatedByMarkdownSupport, setUpdatedByMarkdownSupport] = useState<boolean>(false);
    const [adjustLine, setAdjustLine] = useState<[number, number]>([0, 0]);

    const titleInputElement = useRef<HTMLInputElement>(null);
    const descriptionTextAreaElement = useRef<HTMLTextAreaElement>(null);

    const auth = useContext(AuthContext);
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
            onSubmit={handleHostSubmit({
                updateWork,
                auth,
                notification,
                titleInputElement,
                workId,
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
                        label="Title"
                        placeholder={"Input Title!"}
                        margin="normal"
                        fullWidth
                        defaultValue={currentWork.title}
                        inputRef={titleInputElement}
                        required
                    />
                    <div>
                        <TextField
                            label="Tags"
                            placeholder={"Input Tags!"}
                            onKeyDown={tagInputKeyDown({ tags, setTags })}
                            margin="normal"
                            inputProps={{
                                maxLength: 10,
                            }}
                        />
                        <ChipList>
                            {tags.map(tag =>
                                <Chip
                                    key={tag}
                                    clickable={false}
                                    label={tag}
                                    onDelete={() => setTags(tags.filter(x => tag !== x))}
                                />
                            )}
                        </ChipList>
                    </div>
                </Head>
                <WorkContentArea>
                    <div>
                        <WorkImage
                            src={mainImageUrl}
                            onClick={() => setImageInputDialogOpen(true)}
                        />
                        <div>
                            <TextField
                                label="Description"
                                multiline
                                margin="normal"
                                required
                                placeholder={"Input Description!"}
                                rowsMax={30}
                                fullWidth
                                inputRef={descriptionTextAreaElement}
                                onChange={e => setDescription(e.target.value)}
                                defaultValue={currentWork.description}
                                value={description}
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
                            label="公開する"
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
                        {localization.locationText.works.update}
                    </Button>
                </ActionArea>
            </div>
            {(updateWorkError) &&
                <notification.ErrorComponent message={updateWorkError}/>
            }
            <WorkDialog
                open={workDialogOpend}
                onClose={() => {
                    setWorkDialogOpen(false);
                    setPreviewWork(undefined);
                }}
                work={previewWork}
                userId={auth.token ? auth.token.payload.sub : ""}
            />
            <ImageInputDialog
                open={imageInputDialogOpend}
                onClose={() => setImageInputDialogOpen(false)}
                onChange={submitMainImage({ auth, notification, setMainImageUrl })}
            />
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

const handleHostSubmit = (
    {
        updateWork,
        auth,
        notification,
        titleInputElement,
        workId,
        tags,
        imageUrl,
        description,
        isPublic,
        routerHistory
    }: {
        updateWork: MutationFn<any, OperationVariables>,
        auth: AuthValue,
        notification: NotificationValue,
        titleInputElement: React.RefObject<HTMLInputElement>,
        workId: string,
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

    if (!titleInputElement.current) {
        notification.notification("error", "title input element is not found");
        return;
    }

    await new Promise<Work>(resolve => updateWork({
        variables: {
            work: {
                tags,
                description,
                imageUrl,
                isPublic,
                id: workId,
                title: titleInputElement.current!.value,
                userId: auth.token!.payload.sub,
            }
        },
        optimisticResponse: {
            __typename: "Mutation",
            updateWork: {
                tags,
                description,
                imageUrl,
                isPublic,
                id: workId,
                title: titleInputElement.current!.value,
                userId: auth.token!.payload.sub,
                __typename: "Work"
            }
        },
        update: (_, { data: { updateWork } }) => updateWork.id !== "new" && resolve(updateWork as Work)
    }));

    notification.notification("info", "Updated Work!");
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
