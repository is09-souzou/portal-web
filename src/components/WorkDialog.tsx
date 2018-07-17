import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Chip,
} from "@material-ui/core";
import * as H         from "history";
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
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            activeStep: 0
        });
    }

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
                {...props}
            >
                <img
                    src={work.imageUrl}
                />
                <DialogTitle id="simple-dialog-title">
                    {work.title}
                </DialogTitle>
                <StyledDialogContent>
                    <div>{work.description}</div>
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
                </StyledDialogContent>
            </Dialog>
        );
    }
}

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        width: 30rem;
    }
`;

const StyledChip = styled(Chip)`
    && {
        > :not(:last-child) {
            margin-right: 1rem;
        }
    }
`;
