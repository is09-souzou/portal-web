import React from "react";
import styled from "styled-components";
import {
    Button,
    Chip,
    Input,
    TextField,
    withTheme
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
    // chipsData: any;
    // tslint:disable-next-line:prefer-array-literal
    chipsData: Array<Chip>;
}

export default class extends React.Component<PageComponentProps<void>, State> {

    componentWillMount() {
        this.setState({
            chipsData: [
            ]
        });
    }

    deleteChip = (data: Chip) => () => this.setState({
        chipsData: this.state.chipsData.filter(x => data.key !== x.key)
    })

    tagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            e.preventDefault();
            this.setState({
                chipsData: this.state.chipsData.some(x => x.label === (e.target as any).value) ? this.state.chipsData :
                this.state.chipsData.concat({
                    key: (e.target as any).value,
                    label: (e.target as any).value,
                })
            });
            (e.target as any).value = "";
        }
    }
    render() {
        console.log(this.state.chipsData);
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
                                    filename: `/users/${auth.token!.payload.sub}/works/`,
                                    mimetype: image.type
                                })
                            ]);
                            const signedUrl = results[1];

                            await new Promise(resolve => setTimeout(() => resolve(), 60000));
                            await fileUploadToS3({
                                url: signedUrl,
                                file: image
                            });
                        }}
                    >
                    <div>
                        <StyledTitleField
                                id="title"
                                label="Title"
                                margin="normal"
                        />
                        <InputDiv>
                            <StyledImageInput
                                labelText="upload image"
                                name="image1"
                                width="736"
                                height="414"
                            />
                            <SubImages>
                                <StyledImageInput
                                    labelText="upload image"
                                    name="image2"
                                    width="256"
                                    height="144"
                                />
                                <StyledImageInput
                                    name="image3"
                                    width="256"
                                    height="144"
                                />
                                <StyledImageInput
                                    name="image4"
                                    width="256"
                                    height="144"
                                />
                            </SubImages>
                        </InputDiv>
                        <div>
                            <StyledTextField
                                id="description"
                                label="Description"
                                multiline
                                rows="8"
                                margin="normal"
                            />
                            <TagsInput>
                                {this.state.chipsData.map(data =>
                                    <Chip
                                        key={data.key}
                                        clickable={false}
                                        label={data.label}
                                        onDelete={this.deleteChip(data)}
                                    />
                                )}
                                <Input
                                    placeholder="tags"
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onKeyDown={this.tagInputKeyDown}
                                />
                            </TagsInput>
                            <CreateButton
                                type="submit"
                                component="button"
                                variant="outlined"
                                color="primary"
                            >
                                create
                            </CreateButton>
                        </div>
                        </div>
                    </Host>
                )}
            </Mutation>
        );
    }
}

const Host = styled.form`
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
`;

const InputDiv = styled.div`
    display:flex;
    flex-direction: row;
`;

const SubImages = styled.div`
    &&{
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
    }
`;

const StyledImageInput = styled(ImageInput)`
    margin: 4rem;
`;

const StyledTitleFieldBase = styled(TextField)`
    && {
        margin-top: 2rem;
        margin-left: ${(props: any) => props.theme.spacing.unit}px;
        margin-right: ${(props: any) => props.theme.spacing.unit}px;
        display: flex;
        width: 20rem;
    }
`;

const StyledTitleField = withTheme()(
    (props: any) => <StyledTitleFieldBase {...props}/>
);

const StyledTextFieldBase = styled(TextField)`
    && {
        border-top: 2rem;
        margin-left: ${(props: any) => props.theme.spacing.unit}px;
        margin-right: ${(props: any) => props.theme.spacing.unit}px;
        display: flex;
        width: 20rem;
    }
`;

const StyledTextField = withTheme()(
    (props: any) => <StyledTextFieldBase {...props}/>
);

const TagsInput = styled.div`
    margin-top: 2rem;
    margin-left: 8px;
    margin-right: 8px;
`;

const CreateButton = styled(Button)`
    && {
        margin-top: 6rem;
        width: 3rem;
        height: 1rem;
        float: right;
        display: flex;
    }
`;
