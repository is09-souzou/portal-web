import React, { Fragment }from "react";
import {
    Button,
    Chip,
    TextField
} from "@material-ui/core";
import gql           from "graphql-tag";
import {
    Mutation,
    Query
}  from "react-apollo";
import ReactMarkdown from "react-markdown";
import styled        from "styled-components";
import createSignedUrl        from "../../api/createSignedUrl";
import fileUploadToS3         from "../../api/fileUploadToS3";
import { PageComponentProps } from "../../App";
import ErrorPage              from "../ErrorPage";
import GraphQLProgress        from "../GraphQLProgress";
import Header                 from "../Header";
import ImageInputDialog       from "../ImageInputDialog";
import NotFound               from "../NotFound";
import Page                   from "../Page";
import WorkDialog             from "../WorkDialog";
import { Work }               from "../../graphQL/type";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData?               : Chip[];
    description?             : string;
    imageInputDialogVisible? : boolean;
    mainImageUrl?            : string;
    previewWork?             : Work;
    title?                   : string;
    workDialogVisible?       : boolean;
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

    state = {
        chipsData: undefined,
        description: undefined,
        mainImageUrl: undefined,
        previewWork: undefined,
        title: undefined,
        workDialogVisible: false,
        imageInputDialogVisible: false,
    };

    deleteChip = (data: Chip) => () => this.setState({
        chipsData: this.state.chipsData !== undefined ? this.state.chipsData.filter((x: Chip): boolean => data.key !== x.key) : []
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

    onOpenPreview = () => {
        this.setState({
            previewWork: ({
                id: "preview",
                title: this.state.title,
                description: this.state.description,
                userId: this.props.auth.token!.payload.sub,
                imageUrl: this.state.mainImageUrl,
                tags: this.state.chipsData.map(x => x.label) as string[],
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
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent error={error} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!data.getWork) return <NotFound />;

                        const currentWork = data.getWork as Work;

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
                                                        title: this.state.title ? currentWork.title : this.state.title,
                                                        description: this.state.description ? currentWork.description : this.state.description,
                                                        userId: auth.token!.payload.sub,
                                                        imageUrl: this.state.mainImageUrl ? currentWork.imageUrl : this.state.mainImageUrl,
                                                        tags: this.state.chipsData ? (( this.state.chipsData || [] as Chip[] ).map(x => x.label)) : currentWork.tags,
                                                    }
                                                },
                                                optimisticResponse: {
                                                    __typename: "Mutation",
                                                    updateWork: {
                                                        id: this.props.computedMatch!.params.id,
                                                        title: this.state.title,
                                                        description: this.state.description,
                                                        userId: auth.token!.payload.sub,
                                                        imageUrl: this.state.mainImageUrl,
                                                        tags: this.state.chipsData.map(x => x.label),
                                                        createdAt: +new Date(),
                                                        __typename: "Work"
                                                    }
                                                },
                                                update: (_, { data: { updateWork } }) => updateWork.id !== "new" && resolve(updateWork as Work)
                                            }));
                                            notificationListener.notification("info", "Created Work!");
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
                                                    {(this.state.chipsData || currentWork.tags.map(x => ({key: x, label: x})))
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
                                                    defaultValue={data.getWork.description}
                                                />
                                            </div>
                                            <ReactMarkdown
                                                source={this.state.description ? data.getWork.description : this.state.description}
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
                                                create
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
                    userId={auth.token!.payload.sub}
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
        );
    }
}

const Host = styled.form`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 2rem;
    width: calc(100% - 4rem);
    > * {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
`;

const Head = styled.div`
    display: flex;
    flex-direction: column;
    > :nth-child(1) {
        margin-bottom: 1rem;
    }
    > :nth-child(2) {
        display: flex;
    }
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

const WorkImage = styled.img`
    width: 100%;
    vertical-align: bottom;
    object-fit: cover;
`;

const WorkContentArea = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    > * {
        width: calc(50% - 1rem);
    }
    > :first-child {
        display: flex;
        flex-direction: column;
    }
    > :last-child {
        overflow: auto;
        margin-left: 2rem;
    }
`;

const ActionArea = styled.div`
    display: flex;
    > :first-child {
        flex-grow: 1
    }
    > * {
        margin-left: .5rem !important;
    }
`;
