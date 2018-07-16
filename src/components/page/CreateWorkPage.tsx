import React from "react";
import {
    Button,
    Chip,
    TextField
} from "@material-ui/core";
import gql           from "graphql-tag";
import { Mutation }  from "react-apollo";
import ReactMarkdown from "react-markdown";
import styled        from "styled-components";
import createSignedUrl        from "../../api/createSignedUrl";
import fileUploadToS3         from "../../api/fileUploadToS3";
import { PageComponentProps } from "../../App";
import Header                 from "../Header";
import Page                   from "../Page";
import { Work }               from "../../graphQL/type";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData: Chip[];
    description: string;
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
            userId
            title
            tags
            imageUris
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
            userId
            title
            tags
            imageUris
            createdAt
        }
    }
`);

export default class extends React.Component<PageComponentProps<void>, State> {

    state = {
        chipsData: [] as Chip[],
        description: ""
    };

    deleteChip = (data: Chip) => () => this.setState({
        chipsData: this.state.chipsData.filter((x: Chip): boolean => data.key !== x.key)
    })

    tagInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.state.chipsData.length >= 5)
            return e.preventDefault();

        const inputValue = (e.target as any).value;
        if (e.which === 13 || e.keyCode === 13) {
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

                                        const title = (e.target as any).elements["title"].value;
                                        const description = (e.target as any).elements["description"].value;
                                        const imageFiles = (
                                            [
                                                (e.target as any).elements["create-work-main-image"].files[0],
                                                (e.target as any).elements["create-work-sub-image-1"].files[0],
                                                (e.target as any).elements["create-work-sub-image-2"].files[0],
                                                (e.target as any).elements["create-work-sub-image-3"].files[0],
                                            ].filter(x => x)
                                        );
                                        const results = await Promise.all([
                                            new Promise<Work>(resolve => createWork({
                                                variables: {
                                                    work: {
                                                        title,
                                                        description,
                                                        userId: auth.token!.payload.sub,
                                                        tags: this.state.chipsData.map(x => x.label),
                                                        // tslint:disable-next-line:max-line-length
                                                        imageUris: ["https://s3-ap-northeast-1.amazonaws.com/is09-portal-image/system/broken-image.png"]
                                                    }
                                                },
                                                optimisticResponse: {
                                                    __typename: "Mutation",
                                                    createWork: {
                                                        title,
                                                        description,
                                                        id: "new",
                                                        userId: auth.token!.payload.sub,
                                                        tags: this.state.chipsData.map(x => x.label),
                                                        // tslint:disable-next-line:max-line-length
                                                        imageUris: ["https://s3-ap-northeast-1.amazonaws.com/is09-portal-image/system/broken-image.png"],
                                                        createdAt: +new Date(),
                                                        __typename: "Work"
                                                    }
                                                },
                                                // tslint:disable-next-line:max-line-length
                                                update: (_, { data: { createWork } }) => createWork.id !== "new" && resolve(createWork as Work)
                                            })),
                                            // tslint:disable-next-line:max-line-length
                                            Promise.all(imageFiles.map(async (image: any) => new Promise(async (resolve, reject) => {
                                                try {
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
                                                    resolve(result.uploadedUrl);
                                                } catch (e) {
                                                    reject(e);
                                                }
                                            })))
                                        ]);

                                        await updateWork({
                                            variables: {
                                                work: {
                                                    id: results[0].id,
                                                    userId: auth.token!.payload.sub,
                                                    imageUris: results[1]
                                                }
                                            },
                                            optimisticResponse: {
                                                __typename: "Mutation",
                                                updateWork: {
                                                    title,
                                                    description,
                                                    id: results[0].id,
                                                    userId: auth.token!.payload.sub,
                                                    tags: this.state.chipsData.map(x => x.label),
                                                    imageUris: results[1],
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
                                                margin="normal"
                                                fullWidth
                                                required
                                            />
                                            <div>
                                                <TextField
                                                    placeholder="tags"
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
                                            <TextField
                                                id="description"
                                                label="Description"
                                                multiline
                                                margin="normal"
                                                required
                                                placeholder={`Type Description!`}
                                                rowsMax={40}
                                                // tslint:disable-next-line:max-line-length jsx-no-lambda
                                                onChange={(e: any) => this.setState({ description: e.target.value })}
                                                value={this.state.description}
                                            />
                                            <ReactMarkdown
                                                source={this.state.description}
                                                rawSourcePos
                                            />
                                        </WorkContentArea>
                                        <ActionArea>
                                            <div/>
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
                                    {(updateWorkError || createWorkError)
                                  && <notificationListener.ErrorComponent message={updateWorkError || createWorkError}/>
                                    }
                                </Host>
                            )}
                        </Mutation>
                    )}
                </Mutation>
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
    flex-grow: 1;
    > :nth-child(n + 1) {
        margin-left: .5rem;
    }
`;

const WorkContentArea = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    > * {
        overflow: auto;
        width: calc(50% - 1rem);
    }
    > :last-child {
        margin-left: 2rem;
    }
`;

const ActionArea = styled.div`
    display: flex;
    > :first-child {
        flex-grow: 1
    }
`;
