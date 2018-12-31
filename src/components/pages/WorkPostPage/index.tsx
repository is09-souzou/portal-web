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
import createSignedUrl        from "src/api/createSignedUrl";
import fileUploadToS3         from "src/api/fileUploadToS3";
import { PageComponentProps } from "src/App";
import { LocaleContext }      from "src/components/wrappers/MainLayout";
import Header                 from "src/components/molecules/Header";
import ImageInput             from "src/components/atoms/ImageInput";
import MarkdownSupports       from "src/components/organisms/MarkdownSupports";
import Page                   from "src/components/atoms/Page";
import PortalMarkdown         from "src/components/atoms/PortalMarkdown";
import WorkDialog             from "src/components/organisms/WorkDialog";
import { Work }               from "src/graphQL/type";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData        : Chip[];
    description      : string;
    mainImageUrl     : string;
    previewWork?     : Work;
    isPublic         : boolean;
    title            : string;
    workDialogVisible: boolean;
    descriptionInput?: HTMLTextAreaElement;
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

    state: State = {
        chipsData: [] as Chip[],
        description: "",
        mainImageUrl: "",
        previewWork: undefined,
        isPublic: true,
        title: "",
        workDialogVisible: false,
        descriptionInput: undefined
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
            <LocaleContext.Consumer>
                {({ locale }) => (
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
                                                        label={locale.works.title}
                                                        placeholder={locale.works.inputTitle}
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
                                                </Head>
                                                <WorkContentArea>
                                                    <div>
                                                        <MainImageInput
                                                            labelText={locale.works.image}
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
                                                                label={locale.works.description}
                                                                multiline
                                                                margin="normal"
                                                                required
                                                                placeholder={locale.works.inputDiscription}
                                                                rowsMax={30}
                                                                fullWidth
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                onChange={(e: any) => this.setState({ description: e.target.value })}
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
                                                        {locale.works.preview}
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        component="button"
                                                        variant="raised"
                                                        color="primary"
                                                    >
                                                        {locale.works.create}
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
                            locale={locale.location}
                        />
                    </Page>
                )}
            </LocaleContext.Consumer>
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
