import React from "react";
import styled from "styled-components";
import {
    Button,
    Chip,
    Input,
    TextField,
    withTheme,
    MuiThemeProvider,
    createMuiTheme
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
            if ((e.target as any).value.length > 1 && (e.target as any).value.length <= 10) {
                this.setState({
                    chipsData: this.state.chipsData.some(x => x.label === (e.target as any).value)
                    ? this.state.chipsData
                         : this.state.chipsData.concat({
                             key: (e.target as any).value,
                             label: (e.target as any).value,
                         })
                });
                (e.target as any).value = "";
            }
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

                            await fileUploadToS3({
                                url: signedUrl,
                                file: image
                            });
                        }}
                    >
                        <div>
                            <MuiThemeProvider theme={theme}>
                                <StyledTitleField
                                    id="title"
                                    label="Title"
                                    margin="normal"
                                />
                            </MuiThemeProvider>
                            <InputDiv>
                                <StyledMainImageInput
                                    labelText="upload image"
                                    id="mainImage"
                                    width="544"
                                    height="368"
                                />
                                <SubImages>
                                    <StyledSubImageInput
                                        labelText="upload image"
                                        width="176"
                                        height="104"
                                    />
                                    <StyledSubImageInput
                                        labelText="upload image"
                                        width="176"
                                        height="104"
                                    />
                                    <StyledSubImageInput
                                        labelText="upload image"
                                        width="176"
                                        height="104"
                                    />
                                </SubImages>
                            </InputDiv>
                            <FormWrap>
                                <div>
                                    <MuiThemeProvider theme={theme}>
                                        <StyledTextField
                                            id="description"
                                            label="Description"
                                            multiline
                                            rows="8"
                                            margin="normal"
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <TagsDiv>
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
                                </TagsDiv>
                            </FormWrap>
                        </div>
                    </Host>
                )}
            </Mutation>
        );
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#ffc246",
            main: "#ff9100",
            dark: "#c56200",
            contrastText: "#fff",
        },
    },
    overrides: {
        MuiInput: {
            root: {
                fontSize: "1.2rem",
            },
        },
    },
});

const Host = styled.form`
    margin: 5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const InputDiv = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FormWrap = styled.div`
    && {
        display: flex;
        flex-direction: row;
        @media (max-width: 768px) {
            flex-direction: column;
        }
    }
`;

const TagsDiv = styled.div`
    && {
        display: flex;
        flex-direction: column;
    }
`;

const SubImages = styled.div`
    &&{
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
        @media (max-width: 768px) {
            margin-left: 0rem;
            flex-direction: row;
            justify-content: space-between;
        }
    }
`;

const StyledMainImageInput = styled(ImageInput)`
    && {
        margin: 0;
        display: flex;
        width="480"
        height="368"
    }
`;

const StyledSubImageInput = styled(ImageInput)`
    &&{
        margin: 0;
        display: flex;
        width="192"
        height="104"
    }
`;

const StyledTitleFieldBase = styled(TextField)`
    && {
        margin-top: 2rem;
        margin-left: ${(props: any) => props.theme.spacing.unit}px;
        margin-right: ${(props: any) => props.theme.spacing.unit}px;
        display: flex;
        width: 30rem;
    }
`;

const StyledTitleField = withTheme()(
    (props: any) => <StyledTitleFieldBase {...props}/>
);

const StyledTextFieldBase = styled(TextField)`
    && {
        margin-left: ${(props: any) => props.theme.spacing.unit}px;
        margin-right: ${(props: any) => props.theme.spacing.unit}px;
        display: flex;
        width: 30rem;
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
        margin-top: 10rem;
        margin-left: auto;
        width: 3rem;
        height: 2rem;
        display: flex;
    }
`;
