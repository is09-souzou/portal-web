import React, { Fragment } from "react";
import {
    Avatar,
    Checkbox,
    Dialog,
    DialogContent,
    IconButton,
    Typography,
} from "@material-ui/core";
import Favorite       from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Share          from "@material-ui/icons/Share";
import * as H        from "history";
import ReactMarkdown from "react-markdown";
import styled        from "styled-components";
import formatTagsOfURLQueryParam from "../util/formatTagsOfURLQueryParam";
import getTagsByURLQueryParam    from "../util/getTagsByURLQueryParam";
import { Work }                  from "../graphQL/type";
import Link                      from "./Link";
import FormatStringDate          from "./FormatStringDate";

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
                            <MainImageWrapper>
                                <MainImage
                                    src={work.imageUrl}
                                    onClick={this.openWorkItemImageDialog}
                                    width="100%"
                                />
                            </MainImageWrapper>
                            <StyledDialogContent>
                                <div>
                                    <WorkTitle
                                        variant="subheading"
                                    >
                                        {work.title}
                                    </WorkTitle>
                                    <Typography>
                                        <FormatStringDate
                                            isMillisec={false}
                                            timestamp={work.createdAt}
                                            format="%YYYY%年 %MM%月 %DD%日 %HH%時 %mm%分"
                                            locale="ja-JP"
                                        />
                                    </Typography>
                                </div>
                                <div>
                                    <TagList>
                                        {work.tags && work.tags.map(x =>
                                            <Link
                                                to={(() => {
                                                    const tags = getTagsByURLQueryParam(history);
                                                    return formatTagsOfURLQueryParam(tags.concat(x), tags);
                                                })()}
                                                onClick={onClose}
                                                key={x}
                                            >
                                                <Tag>
                                                    {x}
                                                </Tag>
                                            </Link>
                                        )}
                                    </TagList>
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
                                        <IconButton>
                                            <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                                        </IconButton>
                                        <IconButton>
                                            <Share/>
                                        </IconButton>
                                    </div>
                                </div>
                            </StyledDialogContent>
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
        height: 90vh;
        > :first-child {
            min-width: 38.2%;
            max-width: 38.2%;
            display: flex;
            flex-direction: column;
            background-color: #f6f7f9;
        }
        > :last-child {
            flex-grow: 1;
            padding: 1rem 1.5rem;
            overflow-x: hidden;
            overflow-y: auto;
            color: #333;
            img {
                max-width: 100%;
            }
        }
    }
`;

const StyledDialogContent = styled(DialogContent)`
    && {
        display: flex;
        flex-direction: column;
        > :first-child {
            display: flex;
            flex-direction: column;
        }
        > :nth-child(2) {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            margin-top: 1rem;
        }
    }
`;

const MainImageWrapper = styled.div`
    overflow: hidden;
`;

const MainImage = styled.img`
    display: flex;
    cursor: pointer;
    transition: all .3s ease-out;
    :hover {
        transform: scale(1.2) rotate(-8deg);
    }
`;

const TagList = styled.div`
    > :not(:first-child) {
    }
`;

const Tag = styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    min-width: 4rem;
    cursor: pointer;
    color: #444;
    padding: .1rem 1rem;
    transition: all .3s ease-out;
    border-radius: 32px;
    box-sizing: border-box;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,.3);
    :hover {
        box-shadow: 0px 2px 6px 0px rgba(0,0,0,.3);
        background-color: rgba(255, 255, 255, .3);
    }
    margin: 0.5rem 0.5rem 0 0;
`;

const WorkDialogImage = styled.img`
    width: 100%;
`;

const UserInformation = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0.5rem;
    > :last-child {
        margin-left: 1rem;
        flex-grow: 1;
    }
`;

const WorkTitle = styled(Typography)`
    && {
        margin-top: 1.5rem;
        font-size: 1.8rem;
        line-height: 1.8rem;
        letter-spacing: .1rem;
    }
`;
