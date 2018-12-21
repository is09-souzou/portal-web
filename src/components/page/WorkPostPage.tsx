import React from "react";
import {
    Button,
    Chip,
    FormGroup,
    FormControlLabel,
    Switch,
    TextField
} from "@material-ui/core";
import gql           from "graphql-tag";
import { Mutation }  from "react-apollo";
import styled        from "styled-components";
import createSignedUrl        from "../../api/createSignedUrl";
import fileUploadToS3         from "../../api/fileUploadToS3";
import { PageComponentProps } from "../../App";
import Header                 from "../Header";
import ImageInput             from "../ImageInput";
import MarkdownSupports       from "../MarkdownSupports";
import Page                   from "../Page";
import PortalMarkdown         from "../PortalMarkdown";
import WorkDialog             from "../WorkDialog";
import { Work }               from "../../graphQL/type";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData: Chip[];
    description: string;
    mainImageUrl: string;
    previewWork?: Work;
    isPublic: boolean;
    title: string;
    workDialogVisible: boolean;
    descriptionSelectionStart: number;
    descriptionSelectionEnd: number;
}

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
            isPublic
            createdAt
        }
    }
`);

export default class extends React.Component<PageComponentProps<{id: string}>, State> {

    descriptionInput?: HTMLTextAreaElement;

    state = {
        chipsData: [] as Chip[],
        description: "",
        mainImageUrl: "",
        previewWork: undefined,
        isPublic: true,
        title: "",
        workDialogVisible: false,
        descriptionSelectionStart: 0,
        descriptionSelectionEnd: 0
    };

    needReserection:boolean = false;

    componentDidUpdate() {
        if (this.needReserection) {
            console.log(
                "componentDidUpdate",
                this.state.descriptionSelectionStart,
                this.state.descriptionSelectionEnd
            );
            if (this.descriptionInput) {
                this.descriptionInput.selectionStart = this.state.descriptionSelectionStart;
                this.descriptionInput.selectionEnd   = this.state.descriptionSelectionEnd;
                this.descriptionInput.setSelectionRange(this.state.descriptionSelectionStart, this.state.descriptionSelectionEnd);
            }

            this.needReserection = false;
            console.log(
                "didupdate test",
                this.descriptionInput && this.descriptionInput.selectionStart,
                this.descriptionInput && this.descriptionInput.selectionEnd
            );
        }
    }

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

    onOpenPreview = () => {
        this.setState({
            previewWork: ({
                id: "preview",
                title: this.state.title,
                description: this.state.description,
                userId: (this.props.auth.token || { payload: { sub: "xxx" } }).payload.sub,
                imageUrl: this.state.mainImageUrl,
                tags: this.state.chipsData.map(x => x.label) as string[],
                createdAt: +new Date() / 1000,
                isPublic: this.state.isPublic,
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
                <Mutation mutation={MutationCreateWork} refetchQueries={[]}>
                    {(createWork, { error: createWorkError }) => (
                        <Mutation mutation={MutationUpdateWork} refetchQueries={[]}>
                            {(updateWork, { error: updateWorkError }) => (
                                <Host
                                    // tslint:disable-next-line jsx-no-lambda
                                    onSubmit={async e => {
                                        e.preventDefault();
                                        if (!auth.token)
                                            notificationListener.errorNotification(new Error("Need Sign in"));

                                        const work = await new Promise<Work>(resolve => createWork({
                                            variables: {
                                                work: {
                                                    title: this.state.title,
                                                    description: this.state.description,
                                                    userId: auth.token!.payload.sub,
                                                    imageUrl: this.state.mainImageUrl,
                                                    tags: this.state.chipsData.map(x => x.label),
                                                    isPublic: this.state.isPublic
                                                }
                                            },
                                            optimisticResponse: {
                                                __typename: "Mutation",
                                                createWork: {
                                                    title: this.state.title,
                                                    description: this.state.description,
                                                    id: "new",
                                                    userId: auth.token!.payload.sub,
                                                    imageUrl: this.state.mainImageUrl,
                                                    tags: this.state.chipsData.map(x => x.label),
                                                    isPublic: this.state.isPublic,
                                                    createdAt: +new Date(),
                                                    __typename: "Work"
                                                }
                                            },
                                            update: (_, { data: { createWork } }) => createWork.id !== "new" && resolve(createWork as Work)
                                        }));

                                        await updateWork({
                                            variables: {
                                                work: {
                                                    id: work.id,
                                                    userId: auth.token!.payload.sub,
                                                }
                                            },
                                            optimisticResponse: {
                                                __typename: "Mutation",
                                                updateWork: {
                                                    title: this.state.title,
                                                    description: this.state.description,
                                                    id: work.id,
                                                    imageUrl: this.state.mainImageUrl,
                                                    userId: auth.token!.payload.sub,
                                                    tags: this.state.chipsData.map(x => x.label),
                                                    isPublic: this.state.isPublic,
                                                    createdAt: +new Date(),
                                                    __typename: "Work"
                                                }
                                            }
                                        });

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
                                                value={this.state.title}
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
                                        </Head>
                                        <WorkContentArea>
                                            <div>
                                                <MainImageInput
                                                    labelText="create-work-main-image"
                                                    // tslint:disable-next-line:jsx-no-lambda
                                                    onChange={async e => {
                                                        if (!auth.token)
                                                            notificationListener.errorNotification(new Error("Need Sign in"));
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
                                                        value={this.state.description}
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        inputRef={x => this.descriptionInput = x}
                                                    />
                                                    <MarkdownSupports
                                                        element={this.descriptionInput}
                                                        // tslint:disable-next-line:jsx-no-lambda
                                                        onChangeValue={(description, lines) => {
                                                            this.needReserection = true;
                                                            this.setState(
                                                                {
                                                                    description,
                                                                    descriptionSelectionStart: lines[0],
                                                                    descriptionSelectionEnd: lines[1]
                                                                },
                                                                () => {
                                                                    if (this.descriptionInput) {
                                                                        this.descriptionInput.setSelectionRange(lines[0], lines[1]);
                                                                        console.log(
                                                                            "after setState",
                                                                            this.descriptionInput.selectionStart,
                                                                            this.descriptionInput.selectionEnd
                                                                        );
                                                                        setInterval(
                                                                            () => console.log(
                                                                                "interval test",
                                                                                this.descriptionInput && this.descriptionInput.selectionStart,
                                                                                this.descriptionInput && this.descriptionInput.selectionEnd
                                                                            ),
                                                                            2000
                                                                        );
                                                                        // this.descriptionInput.selectionStart = lines[0];
                                                                        // this.descriptionInput.selectionEnd   = lines[1];
                                                                    }
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <PortalMarkdown
                                                source={this.state.description}
                                                rawSourcePos
                                            />
                                        </WorkContentArea>
                                        <ActionArea>
                                            <div/>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onChange={() =>
                                                                this.setState({
                                                                    isPublic: !this.state.isPublic
                                                                })
                                                            }
                                                            color="primary"
                                                            checked={this.state.isPublic}
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
                                    {(createWorkError || updateWorkError) &&
                                        <notificationListener.ErrorComponent message={createWorkError || updateWorkError}/>
                                    }
                                </Host>
                            )}
                        </Mutation>
                    )}
                </Mutation>
                <WorkDialog
                    history={history}
                    open={this.state.workDialogVisible}
                    onClose={this.onClosePreview}
                    work={this.state.previewWork}
                    userId={auth.token!.payload.sub}
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

const MainImageInput = styled(ImageInput)`
    min-height: 8rem;
    display: flex;
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
