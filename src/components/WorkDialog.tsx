import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Chip,
} from "@material-ui/core";
import * as H         from "history";
import ReactMarkdown from "react-markdown";
import styled         from "styled-components";
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
                <Host>
                    <div>
                        <StyledImage
                            src={work.imageUrl}
                            onClick={this.openWorkItemImageDialog}
                            width="100%"
                        />
                        <DialogTitle id="simple-dialog-title">
                            {work.title}
                        </DialogTitle>
                        <DialogContent>
                            <Typography gutterBottom>制作者</Typography>
                            <Typography gutterBottom>制作日</Typography>
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
                        </DialogContent>
                    </div>
                    <ReactMarkdown
                        source={work.description}
                        rawSourcePos
                    />
                </Host>
                <Dialog
                    open={this.state.workItemImageDialogVisible}
                    onClose={this.closeWorkItemImageDialog}
                    fullWidth
                >
                    <img
                        src={work.imageUrl}
                        width="100%"
                        onClick={this.openWorkItemImageDialog}
                    />
                </Dialog>
            </Dialog>
        );
    }
}

const Host = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    > * {
        overflow: auto;
        width: calc(50% - 1rem);
    }
    > :first-child {
        display: flex;
        flex-direction: column;
    }
    > :last-child {
        margin: 1rem;
        color: black;
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
