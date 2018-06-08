import React from "react";
import styled from "styled-components";
import {
    Button,
    Card,
    CardMedia,
    TextField
} from "@material-ui/core";
import ImageInput from "../ImageInput";

export default class extends React.Component {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false
        });
    }

    render() {
        return (
            <Host>
                <ImageInput
                    labelText="upload image"
                    name="image"
                    width="216"
                    height="216"
                />
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
                    <CreateButton variant="outlined" color="primary">create</CreateButton>
                </div>
            </Host>
        );
    }
}

const Host = styled.form`
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
`;

const StyledTitleField = styled(TextField)`
    && {
        marginLeft: theme.spacing.unit;
        marginRight: theme.spacing.unit;
        display: flex;
    }
`;

const StyledTextField = styled(TextField)`
    && {
        marginLeft: theme.spacing.unit;
        marginRight: theme.spacing.unit;
        display: flex;
    }
`;

const CreateButton = styled(Button)`
        float:right;
        display: flex;
`;
