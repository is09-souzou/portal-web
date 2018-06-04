import React from "react";
import styled from "styled-components";
import {
    Button,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    Typography
} from "@material-ui/core";

export default class extends React.Component<{onMenuButtonClick: (event: React.MouseEvent<HTMLElement>) => void}> {
    state = {
        userMenuAnchorEl: undefined,
        userMenuOpend: false
    };

    render() {
        return (
            <Host>
                {[
                    "F44336", "E91E63", "9C27B0", "673AB7",
                    "3F51B5", "2196F3", "03A9F4", "00BCD4",
                    "009688", "4CAF50", "8BC34A", "CDDC39",
                    "FFEB3B", "FFC107", "FF9800", "FF5722",
                    "795548", "9E9E9E"].map(x =>
                        <StyledCard key={x}>
                            <StyledCardMedia
                                image={`http://placehold.jp/24/${x}/fff/600x400.png`}
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
                    )
                }
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
