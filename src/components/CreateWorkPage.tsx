import React from "react";
import styled from "styled-components";
import {
    Button,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    Typography,
    TextField,
    InputAdornment
} from "@material-ui/core";

export default class extends React.Component<{onMenuButtonClick: (event: React.MouseEvent<HTMLElement>) => void}> {
    state = {
        userMenuAnchorEl: undefined,
        userMenuOpend: false
    };

    render() {
        return (
            <Host>
                <StyledCard>
                    <StyledCardMedia
                        image={`http://placehold.jp/24/8BC34A/fff/600x400.png`}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            Lizard
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">
                        Share
                        </Button>
                        <Button size="small" color="primary">
                        Learn More
                        </Button>
                    </CardActions>
                </StyledCard>
                <StyledForm>
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
                </StyledForm>
            </Host>
        );
    }
}

const Host = styled.div`
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
    && {
        margin: 1rem;
        min-width: 20rem;
        max-width: 30rem;
    }
`;

const StyledCardMedia = styled(CardMedia)`
    && {
        height: 0;
        padding-top: 56.25%;
    }
`;

const StyledForm = styled.div`

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
