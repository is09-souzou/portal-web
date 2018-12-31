import React, { Fragment }         from "react";
import { Button, Chip, TextField } from "@material-ui/core";
import gql                         from "graphql-tag";
import { Mutation, Query }         from "react-apollo";
import createSignedUrl             from "src/api/createSignedUrl";
import fileUploadToS3              from "src/api/fileUploadToS3";
import { PageComponentProps }      from "src/App";
import GraphQLProgress             from "src/components/atoms/GraphQLProgress";
import Page                        from "src/components/atoms/Page";
import PortalMarkdown              from "src/components/atoms/PortalMarkdown";
import Header                      from "src/components/molecules/Header";
import ImageInputDialog            from "src/components/molecules/ImageInputDialog";
import NotFound                    from "src/components/molecules/NotFound";
import MarkdownSupports            from "src/components/organisms/MarkdownSupports";
import WorkDialog                  from "src/components/organisms/WorkDialog";
import ActionArea                  from "src/components/pages/WorkUpdatePage/ActionArea";
import ChipList                    from "src/components/pages/WorkUpdatePage/ChipList";
import Head                        from "src/components/pages/WorkUpdatePage/Head";
import Host                        from "src/components/pages/WorkUpdatePage/Host";
import WorkContentArea             from "src/components/pages/WorkUpdatePage/WorkContentArea";
import WorkImage                   from "src/components/pages/WorkUpdatePage/WorkImage";
import ErrorTemplate               from "src/components/templates/ErrorTemplate";
import { LocaleContext }           from "src/components/wrappers/MainLayout";
import { Work }                    from "src/graphQL/type";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData?              : Chip[];
    description?            : string;
    imageInputDialogVisible : boolean;
    mainImageUrl?           : string;
    previewWork?            : Work;
    title?                  : string;
    workDialogVisible       : boolean;
    descriptionInput?       : HTMLTextAreaElement;
}

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

export default class extends React.Component<PageComponentProps<{id: string}>, State> {

    state: State = {
        chipsData: undefined,
        description: undefined,
        mainImageUrl: undefined,
        previewWork: undefined,
        title: undefined,
        workDialogVisible: false,
        imageInputDialogVisible: false,
        descriptionInput: undefined
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

    onOpenPreview = () => {
        this.setState({
            previewWork: ({
                id: "preview",
                title: this.state.title || "",
                description: this.state.description || "",
                userId: this.props.auth.token!.payload.sub,
                imageUrl: this.state.mainImageUrl || "",
                tags: (this.state.chipsData || [] as Chip[]).map(x => x.label) as string[],
                createdAt: +new Date() / 1000,
                user: {
                    id: "preview",
                    email: "preview",
                    displayName: "display name",
                    career: "career",
                    avatarUri: "/img/no-image.png",
                    message: "message"
                }
            }),
            workDialogVisible: true
        });
    }

    onClosePreview = () => this.setState({ previewWork: undefined, workDialogVisible: false });

    onOpenImageInputDialog = () => this.setState({ imageInputDialogVisible: true });

    onCloseImageInputDialog = () => this.setState({ imageInputDialogVisible: false });

    render() {
        const {
            auth,
            history,
            notificationListener,
        } = this.props;

        return (
            <LocaleContext.Consumer>
                {({ locale }) => (
                    <Page>
                        <Header
                            auth={auth}
                            history={history}
                            notificationListener={notificationListener}
                        />
                        <Query
                            query={QueryGetWorkById}
                            variables={{ id: this.props.computedMatch!.params.id }}
                            fetchPolicy="cache-and-network"
                        >
                            {({ loading, error, data }) => {
                                if (loading) return <GraphQLProgress />;
                                if (error) {
                                    return (
                                        <Fragment>
                                            <ErrorTemplate/>
                                            <notificationListener.ErrorComponent error={error} key="error"/>
                                        </Fragment>
                                    );
                                }

                                if (!data.getWork) return <NotFound />;

                                const currentWork = data.getWork as Work;

                                // FIXME: Render methods should be a pure function of props and state.
                                if (this.state.chipsData === undefined)
                                    this.setState({
                                        chipsData: currentWork.tags.map(x => ({ key: x, label: x }))
                                    });

                                return (
                                    <Mutation mutation={MutationUpdateWork} refetchQueries={[]}>
                                        {(updateWork, { error: updateWorkError }) => (
                                            <Host
                                                // tslint:disable-next-line jsx-no-lambda
                                                onSubmit={async e => {
                                                    e.preventDefault();
                                                    await new Promise<Work>(resolve => updateWork({
                                                        variables: {
                                                            work: {
                                                                id: this.props.computedMatch!.params.id,
                                                                title: this.state.title ? this.state.title : currentWork.title,
                                                                description: this.state.description ? this.state.description : currentWork.description,
                                                                userId: auth.token!.payload.sub,
                                                                imageUrl: this.state.mainImageUrl ? this.state.mainImageUrl : currentWork.imageUrl,
                                                                tags: (
                                                                    this.state.chipsData ? ((this.state.chipsData || [] as Chip[]).map(x => x.label))
                                                                  :                        currentWork.tags
                                                                )
                                                            }
                                                        },
                                                        optimisticResponse: {
                                                            __typename: "Mutation",
                                                            updateWork: {
                                                                id: this.props.computedMatch!.params.id,
                                                                title: this.state.title ? this.state.title : currentWork.title,
                                                                description: this.state.description ? this.state.description : currentWork.description,
                                                                userId: auth.token!.payload.sub,
                                                                imageUrl:  this.state.mainImageUrl ? this.state.mainImageUrl : currentWork.imageUrl,
                                                                tags: (
                                                                    this.state.chipsData ? ((this.state.chipsData || [] as Chip[]).map(x => x.label))
                                                                  :                        currentWork.tags
                                                                ),
                                                                __typename: "Work"
                                                            }
                                                        },
                                                        update: (_, { data: { updateWork } }) => updateWork.id !== "new" && resolve(updateWork as Work)
                                                    }));
                                                    notificationListener.notification("info", "Updated Work!");
                                                    history.push("/");
                                                }}
                                            >
                                                <div>
                                                    <Head>
                                                        <TextField
                                                            id="title"
                                                            label="Title"
                                                            placeholder={"Input Title!"}
                                                            margin="normal"
                                                            fullWidth
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onChange={(e: any) => this.setState({
                                                                title: e.target.value
                                                            })}
                                                            defaultValue={currentWork.title}
                                                            required
                                                        />
                                                        <div>
                                                            <TextField
                                                                label="Tags"
                                                                placeholder={"Input Tags!"}
                                                                onKeyDown={this.tagInputKeyDown}
                                                                margin="normal"
                                                                inputProps={{
                                                                    maxLength: 10,
                                                                }}
                                                            />
                                                            <ChipList>
                                                                {(this.state.chipsData || currentWork.tags.map(x => ({ key: x, label: x })))
                                                                    .map(data =>
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
                                                    </Head>
                                                    <WorkContentArea>
                                                        <div>
                                                            <WorkImage
                                                                src={(
                                                                    this.state.mainImageUrl === "" ? currentWork.imageUrl : this.state.mainImageUrl
                                                                )}
                                                                onClick={this.onOpenImageInputDialog}
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
                                                                    // tslint:disable-next-line:jsx-no-lambda
                                                                    onChange={(e: any) => this.setState({ description: e.target.value })}
                                                                    defaultValue={currentWork.description}
                                                                    value={this.state.description}
                                                                    // tslint:disable-next-line:jsx-no-lambda
                                                                    inputRef={descriptionInput => this.setState({ descriptionInput })}
                                                                />
                                                                <MarkdownSupports
                                                                    element={this.state.descriptionInput}
                                                                    // tslint:disable-next-line:jsx-no-lambda
                                                                    onChangeValue={(description, lines) => {
                                                                        this.setState(
                                                                            { description },
                                                                            () => {
                                                                                if (this.state.descriptionInput) {
                                                                                    this.state.descriptionInput.setSelectionRange(lines[0], lines[1]);
                                                                                }
                                                                            }
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <PortalMarkdown
                                                            source={this.state.description ? this.state.description : currentWork.description}
                                                            rawSourcePos
                                                        />
                                                    </WorkContentArea>
                                                    <ActionArea>
                                                        <div/>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={this.onOpenPreview}
                                                        >
                                                            preview
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            component="button"
                                                            variant="raised"
                                                            color="primary"
                                                        >
                                                            update
                                                        </Button>
                                                    </ActionArea>
                                                </div>
                                                {(updateWorkError) &&
                                                <notificationListener.ErrorComponent message={updateWorkError}/>
                                                }
                                            </Host>
                                        )}
                                    </Mutation>
                                );
                            }}
                        </Query>
                        <WorkDialog
                            history={history}
                            open={this.state.workDialogVisible}
                            onClose={this.onClosePreview}
                            work={this.state.previewWork}
                            userId={auth.token ? auth.token.payload.sub : ""}
                            locale={locale.location}
                        />
                        <ImageInputDialog
                            open={this.state.imageInputDialogVisible}
                            onClose={this.onCloseImageInputDialog}
                            // tslint:disable-next-line:jsx-no-lambda
                            onChange={async e => {
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
                                this.setState({
                                    mainImageUrl: result.uploadedUrl
                                });
                            }}
                        />
                    </Page>
                )}
            </LocaleContext.Consumer>
        );
    }
}
