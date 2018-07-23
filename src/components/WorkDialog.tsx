import React, { Fragment } from "react";
import {
    Avatar,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    Typography,
    Chip,
} from "@material-ui/core";
import {
    Favorite,
    FavoriteBorder,
    Share
} from "@material-ui/icons";
import * as H        from "history";
import ReactMarkdown from "react-markdown";
import styled        from "styled-components";
import formatTagsOfURLQueryParam from "../util/formatTagsOfURLQueryParam";
import getTagsByURLQueryParam    from "../util/getTagsByURLQueryParam";
import { Work }                  from "../graphQL/type";
import Link                      from "./Link";

interface Props {
    open: boolean;
    onClose: () => void;
    work?: Work;
    history: H.History;
}

interface State {
    workItemImageDialogVisible: boolean;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            workItemImageDialogVisible: false
        });
    }

    openWorkItemImageDialog = () => this.setState({ workItemImageDialogVisible: true });

    closeWorkItemImageDialog = () => this.setState({ workItemImageDialogVisible: false });

    render() {
        const {
            history,
            open = false,
            onClose,
            work,
            ...props
        } = this.props;

        if (!work)
            return null;

        return (
            <Fragment>
                <Dialog
                    open={open}
                    onClose={onClose}
                    keepMounted
                    aria-labelledby="simple-dialog-title"
                    fullWidth
                    maxWidth="md"
                    BackdropProps={{
                        style: {
                            backgroundColor: "transparent",
                        }
                    }}
                    {...props}
                >
                    <WorkContent>
                        <div>
                            <div>
                                <StyledImage
                                    src={work.imageUrl}
                                    onClick={this.openWorkItemImageDialog}
                                    width="100%"
                                />
                                <DialogTitle id="simple-dialog-title" disableTypography>
                                    <StyledTypography variant="headline">
                                        {work.title}
                                    </StyledTypography>
                                </DialogTitle>
                            </div>
                            <div>
                                <UserInformation>
                                    <Avatar
                                        alt={work.user.displayName}
                                        src={work.user.avatarUri}
                                    />
                                    <div>
                                        <Typography gutterBottom variant="caption">{work.user.message}</Typography>
                                        <Typography gutterBottom>{work.user.displayName}</Typography>
                                    </div>
                                </UserInformation>
                                <div>
                                    {work.tags && work.tags.map(x =>
                                        <Link
                                            to={(() => {
                                                const tags = getTagsByURLQueryParam(history);
                                                return formatTagsOfURLQueryParam(tags.concat(x), tags);
                                            })()}
                                            onClick={onClose}
                                            key={x}
                                        >
                                            <StyledChip
                                                clickable={false}
                                                label={x}
                                            />
                                        </Link>
                                    )}
                                </div>
                                <DialogActions>
                                    <IconButton>
                                        <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                                    </IconButton>
                                    <IconButton>
                                        <Share/>
                                    </IconButton>
                                </DialogActions>
                            </div>
                        </div>
                        <div>
                            <ReactMarkdown
                                source={work.description}
                                rawSourcePos
                            />
                        </div>
                    </WorkContent>
                </Dialog>
                <Dialog
                    open={this.state.workItemImageDialogVisible}
                    onClose={this.closeWorkItemImageDialog}
                >
                    <WorkDialogImage
                        src={work.imageUrl}
                        onClick={this.openWorkItemImageDialog}
                    />
                </Dialog>
            </Fragment>
        );
    }
}

const WorkContent = styled.div`
    && {
        display: flex;
        height: 80vh;
        > :first-child {
            min-width: 38.2%;
            max-width: 38.2%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #ccc;
        }
        > :last-child {
            flex-grow: 1
            margin: 1rem;
            overflow-x: hidden;
            overflow-y: auto;
            color: #333;
        }
    }
`;

const StyledChip = styled(Chip)`
    && {
        > :not(:last-child) {
            margin-right: 1rem;
        }
    }
`;

const StyledImage = styled.img`
    cursor: pointer;
`;

const StyledTypography = styled(Typography)`
    && {
        text-decoration: underline;
        color: #333;
    }
`;

const WorkDialogImage = styled.img`
    width: 100%;
`;

const UserInformation = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1rem;
    > :last-child {
        margin-left: 1rem;
        flex-grow: 1;
    }
`;
