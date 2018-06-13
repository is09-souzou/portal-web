import React from "react";
import styled from "styled-components";
import {
    Button,
    TextField,
    withTheme
} from "@material-ui/core";
import ImageInput from "../ImageInput";
import { Mutation } from "react-apollo";
import MutationCreateWork from "../../GraphQL/mutation/MutationCreateWork";
import { PageComponentProps } from "../../App";
import createSignedUrl from "../../api/createSignedUrl";
import fileUploadToS3  from "../../api/fileUploadToS3";

export default class extends React.Component<PageComponentProps<{}>> {

    render() {

        const {
            auth
        } = this.props;

        return (
            <Mutation mutation={MutationCreateWork} >
                {(createWork, data) => console.log(data) || (
                    <Host
                        // tslint:disable-next-line jsx-no-lambda
                        onSubmit={async e => {
                            e.preventDefault();

                            const title = (e.target as any).elements["title"].value;
                            const description = (e.target as any).elements["description"].value;
                            console.log("TITLE:" + title);
                            console.log("DESCRIPTION:" + description);
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
                            });

                            // Memo Testでここを使わせてもらいます。

                            const image = (e.target as any).elements["image1"].files[0];
                            const signedUrl = await createSignedUrl({
                                jwt: auth.token!.jwtToken,
                                filename: `/users/${auth.token!.payload.sub}/works/`,
                                mimetype: image.type
                            });
                            await new Promise(resolve => setTimeout(() => resolve(), 60000));
                            await fileUploadToS3({
                                url: signedUrl,
                                file: image
                            });
                        }}
                    >
                        <InputImages>
                            <ImageInput
                                labelText="upload image"
                                name="image1"
                                width="216"
                                height="216"
                            />
                            <SubImages>
                                <ImageInput
                                    labelText="upload image"
                                    name="image2"
                                    width="108"
                                    height="108"
                                />
                                <ImageInput
                                    labelText="upload image"
                                    name="image3"
                                    width="108"
                                    height="108"
                                />
                                <ImageInput
                                    labelText="upload image"
                                    name="image4"
                                    width="108"
                                    height="108"
                                />
                            </SubImages>
                            <div>
                                <StyledTitleField
                                    id="title"
                                    label="Title"
                                    margin="normal"
                                />
                                <StyledTextField
                                    id="description"
                                    label="Description"
                                    multiline
                                    rows="6"
                                    margin="normal"
                                />
                                <CreateButton
                                    type="submit"
                                    component="button"
                                    variant="outlined"
                                    color="primary"
                                >
                                    create
                                </CreateButton>
                            </div>
                        </InputImages>
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

const SubImages = styled.div`
    &&{
        display: flex;
    }
`;

const InputImages = styled.div`
    && {
        margin: 1erm;
    }
`;

const StyledTitleField = styled(TextField)`
    && {
        marginLeft: theme.spacing.unit;
        marginRight: theme.spacing.unit;
        display: flex;
    }
`;

const StyledTextFieldBase = styled(TextField)`
    && {
        border-top: 1px;
        margin-left: ${(props: any) => props.theme.spacing.unit}px;
        margin-right: ${(props: any) => props.theme.spacing.unit}px;
    }
`;

const StyledTextField = withTheme()(
    (props: any) => <StyledTextFieldBase {...props}/>
);

const CreateButton = styled(Button)`
    && {
        float:right;
        display: flex;
    }
`;
