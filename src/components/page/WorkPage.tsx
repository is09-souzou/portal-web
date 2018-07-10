import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    Typography
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import styled             from "styled-components";
import { PageComponentProps } from "./../../App";
import Fab                    from "../Fab";
import Header                 from "../Header";
import Page                   from "../Page";
import LearnMoreDialog from "../LearnMoreDialog";

interface SelectedWork {
    title: string;
    imagePath: string[];
}

interface State {
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
    learnMoreDialogOpend: boolean;
    selectedWork: SelectedWork;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false,
            learnMoreDialogOpend: false,
            selectedWork: {
                title: "",
                imagePath: [""],
            },
        });
    }

    handleClickOpen = (y: SelectedWork) => () => {
        this.setState({
            learnMoreDialogOpend: true,
            selectedWork: {
                title: y.title,
                imagePath: y.imagePath,
            },
        });
    }

    handleClose = () => this.setState({ learnMoreDialogOpend: false });

    render() {

        const {
            auth,
            history,
            notificationListener,
        } = this.props;

        const images :{title:string, imagePath:string[]}[] = [
            {
                title: "abc",
                imagePath: [
                    "http://placehold.jp/24/F44336/fff/600x400.png",
                    "http://placehold.jp/24/E91E63/fff/600x400.png",
                    "http://placehold.jp/24/9C27B0/fff/600x400.png",
                    "http://placehold.jp/24/673AB7/fff/600x400.png",
                ],
            },
            {
                title: "def",
                imagePath: [
                    "http://placehold.jp/24/3F51B5/fff/600x400.png",
                    "http://placehold.jp/24/2196F3/fff/600x400.png",
                    "http://placehold.jp/24/03A9F4/fff/600x400.png",
                    "http://placehold.jp/24/00BCD4/fff/600x400.png",
                ],
            },
            {
                title: "ghi",
                imagePath: [
                    "http://placehold.jp/24/009688/fff/600x400.png",
                    "http://placehold.jp/24/4CAF50/fff/600x400.png",
                    "http://placehold.jp/24/8BC34A/fff/600x400.png",
                    "http://placehold.jp/24/CDDC39/fff/600x400.png",
                ],
            },
            {
                title: "jkl",
                imagePath: [
                    "http://placehold.jp/24/FFEB3B/fff/600x400.png",
                    "http://placehold.jp/24/FFC107/fff/600x400.png",
                    "http://placehold.jp/24/FF9800/fff/600x400.png",
                    "http://placehold.jp/24/FF5722/fff/600x400.png",
                ],
            },
            {
                title: "mno",
                imagePath: [
                    "http://placehold.jp/24/795548/fff/600x400.png",
                    "http://placehold.jp/24/9E9E9E/fff/600x400.png",
                ],
            },
        ];

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Host>
                    {images.map(x =>
                            <StyledCard key={x.title}>
                                <StyledCardMedia
                                    image={`${x.imagePath[0]}`}
                                    title={x.title}
                                    onClick={this.handleClickOpen(x)}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="headline" component="h2">
                                        {x.title}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        Share
                                    </Button>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={this.handleClickOpen(x)}
                                    >
                                        Learn More
                                    </Button>
                                </CardActions>
                            </StyledCard>
                        )
                    }
                    <LearnMoreDialog
                        open={this.state.learnMoreDialogOpend}
                        onClose={this.handleClose}
                        selectedWork={this.state.selectedWork}
                    />
                </Host>
                <Fab
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => history.push("/works/create-work")}
                >
                    <AddIcon />
                </Fab>
            </Page>
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
