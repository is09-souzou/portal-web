import React from "react";
import styled from "styled-components";
import {
    Button,
    Chip,
    TextField,
} from "@material-ui/core";
import ImageInput from "../ImageInput";
import { Mutation } from "react-apollo";
import MutationCreateWork from "../../GraphQL/mutation/MutationCreateWork";
import { PageComponentProps } from "../../App";
import createSignedUrl from "../../api/createSignedUrl";
import fileUploadToS3  from "../../api/fileUploadToS3";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData: Chip[];
}

export default class extends React.Component<PageComponentProps<void>, State> {
    host: any;

    componentWillMount() {
        this.setState({
            chipsData: [],
        });
    }

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
            auth
        } = this.props;

        return (
            <Mutation mutation={MutationCreateWork} refetchQueries={[]}>
                {(createWork, data) => console.log(data) || (
                    <Host
                        // tslint:disable-next-line jsx-no-lambda
                        onSubmit={async e => {
                            e.preventDefault();

                            const title = (e.target as any).elements["title"].value;
                            const description = (e.target as any).elements["description"].value;
                            console.log("TITLE:" + title);
                            console.log("DESCRIPTION:" + description);

                            // Memo Testでここを使わせてもらいます。

                            const image = (e.target as any).elements["image1"].files[0];
                            const results = await Promise.all([
                                createWork({
                                    variables: {
                                        work: {
                                            title,
                                            description,
                                            imageUri: "test.comyy/test",
                                            userId: auth.token!.payload.sub
                                        }
                                    },
                                    optimisticResponse: {
                                        __typename: "Mutation",
                                        createWork: {
                                            title,
                                            description,
                                            id: "",
                                            userId: auth.token!.payload.sub,
                                            tags: [],
                                            imageUri: "test.comyy/test",
                                            createdAt: "",
                                            __typename: "Work"
                                        }
                                    }
                                }),
                                createSignedUrl({
                                    jwt: auth.token!.jwtToken,
                                    userId: auth.token!.payload.sub,
                                    type: "work",
                                    mimetype: image.type
                                })
                            ]);
                            const signedUrl = results[1];

                            await fileUploadToS3({
                                url: signedUrl,
                                file: image
                            });
                        }}
                        ref={(host:any) => this.host = host}
                    >
                        <div>
                            <TextField
                                id="title"
                                label="Title"
                                margin="normal"
                                fullWidth
                            />
                            <ImageSelectArea>
                                <ImageInput
                                    labelText="upload image"
                                    name="mainImage"
                                    width="544"
                                    height="368"
                                />
                                <div>
                                    <ImageInput
                                        name="subImage1"
                                        width="176"
                                        height="104"
                                    />
                                    <ImageInput
                                        name="subImage2"
                                        width="176"
                                        height="104"
                                    />
                                    <ImageInput
                                        name="subImage3"
                                        width="176"
                                        height="104"
                                    />
                                </div>
                            </ImageSelectArea>
                            <TextField
                                id="description"
                                label="Description"
                                multiline
                                rows="8"
                                margin="normal"
                                fullWidth
                            />
                            <div>
                                <TextField
                                    placeholder="tags"
                                    onKeyDown={this.tagInputKeyDown}
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                />
                                {this.state.chipsData.map(data =>
                                    <Chip
                                        key={data.key}
                                        clickable={false}
                                        label={data.label}
                                        onDelete={this.deleteChip(data)}
                                    />
                                )}
                            </div>
                            <ActionArea>
                                <div/>
                                <Button
                                    variant="raised"
                                    color="primary"
                                >
                                    create
                                </Button>
                            </ActionArea>
                        </div>
                    </Host>
                )}
            </Mutation>
        );
    }
}

const Host = styled.form`
    margin: 5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const ImageSelectArea = styled.div`
    display:flex;
    flex-direction: row;
    align-items: flex-end;
    @media (max-width: 768px) {
        flex-direction: column;
    }
    > :last-child {
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        @media (max-width: 768px) {
            width: 100%;
            margin-left: 0rem;
            flex-direction: row;
            justify-content: space-between;
        }
    }
`;

const ActionArea = styled.div`
    display: flex;
    > :first-child {
        flex-grow: 1
    }
`;
