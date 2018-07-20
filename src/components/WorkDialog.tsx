import React, { Fragment } from "react";
import {
    Avatar,
    Dialog,
    DialogTitle,
    Typography,
    Chip,
} from "@material-ui/core";
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
                            <StyledImage
                                src={work.imageUrl}
                                onClick={this.openWorkItemImageDialog}
                                width="100%"
                            />
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
                        </div>
                        <div>
                            <DialogTitle id="simple-dialog-title">
                                {work.title}
                            </DialogTitle>
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
            border-right: 1px solid #ccc;
            min-width: 38.2%;
            max-width: 38.2%;
            display: flex;
            flex-direction: column;
        }
        > :last-child {
            flex-grow: 1
            margin: 1rem;
            overflow: auto;
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

const WorkDialogImage = styled.img`
    width: 100%;
`;

const UserInformation = styled.div`
    display: flex;
    flex-direction: row;
    > :first-child {
        width: 4rem;
    }
    > :last-child {
        flex-grow: 1;
    }
`;
