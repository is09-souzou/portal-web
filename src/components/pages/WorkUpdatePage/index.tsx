import { Button, Chip, FormControlLabel, FormGroup, Switch, TextField } from "@material-ui/core";
import { ApolloError } from "apollo-client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useRef, useState, Fragment } from "react";
import { Mutation, MutationFn, OperationVariables, Query, QueryResult } from "react-apollo";
import FlexibleSpace from "src/components/atoms/FlexibleSpace";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import LocationText from "src/components/atoms/LocationText";
import Page from "src/components/atoms/Page";
import PortalMarkdown from "src/components/atoms/PortalMarkdown";
import Header from "src/components/molecules/Header";
import ImageInputDialog from "src/components/molecules/ImageInputDialog";
import NotFound from "src/components/molecules/NotFound";
import MarkdownHintDialog from "src/components/organisms/MarkdownHintDialog";
import MarkdownSupports from "src/components/organisms/MarkdownSupports";
import WorkDialog from "src/components/organisms/WorkDialog";
import { handleMarkdownSupportsChangeValue, handlePreviewWork, submitMainImage, tagInputKeyPress } from "src/components/pages/WorkPostPage";
import ActionArea from "src/components/pages/WorkPostPage/ActionArea";
import ActionButtonWrapper from "src/components/pages/WorkPostPage/ActionButtonWrapper";
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
    if (!urlMatch)
        return (<NotFound/>);

    const workId = urlMatch![1];

    return (
        <Page
            {...props}
            ref={props.ref as any}
        >
            <Header
                title={<LocationText text="Work update"/>}
                searchable={false}
            />
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
                            <notification.ErrorComponent message={query.error.message}/>
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
    const [hintDialogOpend, setHintDialogOpen] = useState<boolean>(false);
    const [imageInputDialogOpend, setImageInputDialogOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>(currentWork.tags || []);
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
                setUpdatedByMarkdownSupport(false);
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
                        label={<LocationText text="Title"/>}
                        placeholder={localization.locationText["Input title"]}
                        margin="normal"
                        fullWidth
                        defaultValue={currentWork.title}
                        inputRef={titleInputElement}
                        required
                    />
                    <div>
                        <TextField
                            label={<LocationText text="Tags"/>}
                            placeholder={localization.locationText["Input tags"]}
                            onKeyDown={tagInputKeyPress({ tags, setTags })}
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
                                label={<LocationText text="Description"/>}
                                multiline
                                margin="normal"
                                required
                                placeholder={localization.locationText["Input description"]}
                                rowsMax={30}
                                fullWidth
                                inputRef={descriptionTextAreaElement}
                                onChange={e => setDescription(e.target.value)}
                                value={description}
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
                            label={<LocationText text="Publish" />}
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
                            <LocationText text="Update"/>
                        </Button>
                    </ActionButtonWrapper>
                </ActionArea>
            </div>
            {updateWorkError && <notification.ErrorComponent message={updateWorkError.message}/>}
            <MarkdownHintDialog
                open={hintDialogOpend}
                onClose={() => setHintDialogOpen(false)}
            />
            <WorkDialog
                editable={true}
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
        console.error(new Error("Need Sign in"));
        return;
    }

    if (!titleInputElement.current) {
        notification.notification("error", "Title input element is not found");
        console.error(new Error("Title input element is not found"));
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
