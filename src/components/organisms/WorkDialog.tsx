import {
    Avatar,
    Button,
    Dialog,
    IconButton,
    Toolbar
} from "@material-ui/core";
import AppBar, { AppBarProps } from "@material-ui/core/AppBar";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import gql from "graphql-tag";
import React, { useContext, useState, Fragment } from "react";
import { Query } from "react-apollo";
import convertToQueryString from "src/api/convertToQueryString";
import toArrayFromQueryString from "src/api/toArrayFromQueryString";
import FormatStringDate from "src/components/atoms/FormatStringDate";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Link from "src/components/atoms/Link";
import PortalMarkdown from "src/components/atoms/PortalMarkdown";
import LocalizationContext, { LocalizationValue } from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { Work } from "src/graphQL/type";
import styled from "styled-components";

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            displayName
            avatarUri
            message
        }
    }
`);
interface Props {
    editable: boolean;
    open: boolean;
    onClose: () => void;
    work?: Work;
    userId: string;
}

export default (
    {
        editable = false,
        open = false,
        onClose,
        work,
        userId,
        ...props
    }: Props
) => {

    const [imageDialogOpend, setImageDialogOpen] = useState<boolean>(false);
    const routerHistory = useContext<RouterHistoryValue>(RouterHistoryContext);
    const localization = useContext<LocalizationValue>(LocalizationContext);
    const notification = useContext<NotificationValue>(NotificationContext);

    if (!work)
        return null;

    return (
        <Fragment>
            <Dialog
                open={open}
                fullScreen={window.innerWidth < 767}
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
                        {window.innerWidth < 767 && (
                            <WorkAppBar>
                                <Toolbar>
                                    <Typography variant="h6" color="inherit">
                                        {`${work.title} - ${work.user && work.user.displayName}`}
                                    </Typography>
                                    <IconButton color="inherit" onClick={onClose} aria-label="Close">
                                        <CloseIcon/>
                                    </IconButton>
                                </Toolbar>
                            </WorkAppBar>
                        )}
                        <MainImageWrapper>
                            <MainImage
                                src={work.imageUrl}
                                onClick={() => setImageDialogOpen(true)}
                                width="100%"
                                rotate={(Math.random() > 0.5 ? "-" : "") + Math.floor(Math.random() * (8 - 4 + 1) + 4)}
                            />
                        </MainImageWrapper>
                        <StyledDialogContent>
                            <div>
                                <WorkTitle
                                    variant="subtitle1"
                                >
                                    {work.title}
                                </WorkTitle>
                                <Typography>
                                    <FormatStringDate
                                        isMillisec={false}
                                        timestamp={work.createdAt}
                                        format={
                                            localization.location === "jp"
                                            ? "%YYYY%年 %MM%月 %DD%日 %HH%時 %mm%分"
                                            : "%MMMM% %DD%, %YYYY% at %hh%:%mm% %A%"
                                        }
                                        locale={localization.location === "jp" ? "ja-JP" : "en-US"}
                                    />
                                </Typography>
                            </div>
                            <div>
                                <TagList>
                                    {work.tags && work.tags.map(x =>
                                        <Link
                                            to={(() => {
                                                const tags = toArrayFromQueryString("tags", routerHistory.history);
                                                return convertToQueryString("tags", tags.concat(x), tags);
                                            })()}
                                            onClick={onClose}
                                            key={x}
                                        >
                                            <Tag>{x}</Tag>
                                        </Link>
                                    )}
                                </TagList>
                                <div>
                                    <Link
                                        to={`/users/${work.userId}`}
                                        onClick={onClose}
                                    >
                                        {
                                            work.user ? (
                                                <UserInformation>
                                                    <Avatar
                                                        alt={work.user && work.user.displayName}
                                                        src={work.user && work.user.avatarUri}
                                                    />
                                                    <div>
                                                        <Typography gutterBottom variant="caption">{work.user && work.user.message}</Typography>
                                                        <Typography gutterBottom>{work.user && work.user.displayName}</Typography>
                                                    </div>
                                                </UserInformation>
                                            )
                                          :             (
                                                <Query
                                                    query={QueryGetUser}
                                                    variables={{ id: work.userId }}
                                                    fetchPolicy="network-only"
                                                >
                                                    {(query => (
                                                        query.loading                       ? <GraphQLProgress/>
                                                      : query.error                         ? <notification.ErrorComponent message={query.error.message}/>
                                                      :                                       (
                                                            <UserInformation>
                                                                <Avatar
                                                                    alt={query.data && query.data.getUser && query.data.getUser.displayName}
                                                                    src={query.data && query.data.getUser && query.data.getUser.avatarUri}
                                                                />
                                                                <div>
                                                                    <Typography gutterBottom variant="caption">
                                                                        {query.data && query.data.getUser && query.data.getUser.message}
                                                                    </Typography>
                                                                    <Typography gutterBottom>
                                                                        {query.data && query.data.getUser && query.data.getUser.displayName}
                                                                    </Typography>
                                                                </div>
                                                            </UserInformation>
                                                      )
                                                    ))}
                                                </Query>
                                            )
                                        }
                                    </Link>
                                    {(!editable && work.userId === userId) && (
                                        <Link
                                            to={`/works/update-work/${work.id}`}
                                            onClick={onClose}
                                        >
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                            >
                                                edit
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </StyledDialogContent>
                    </div>
                    <div>
                        <PortalMarkdown
                            source={work.description}
                        />
                    </div>
                </WorkContent>
            </Dialog>
            <Dialog
                open={imageDialogOpend}
                onClose={() => setImageDialogOpen(false)}
            >
                <WorkDialogImage
                    src={work.imageUrl}
                    onClick={() => setImageDialogOpen(false)}
                />
            </Dialog>
        </Fragment>
    );
};

const WorkAppBar = styled(AppBar as React.SFC<AppBarProps>)`
    && {
        width: calc(100% - 6rem);
        margin: 1rem 3rem 0 2rem;
        background-color: white;
        color: #333;
        display: flex;
        border-radius: 8px;
        > :first-child {
            display: flex;
            > :first-child {
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
`;

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
        @media (max-width: 767px) {
            height: 100vh;
            flex-direction: column;
            margin-top: 7rem;
            > :first-child {
                min-width: 100%;
                max-width: 100%;
                height: 80rem;
                min-height: min-content;
            }
            > :last-child {
                min-height: max-content;
            }
        }
    }
`;

const StyledDialogContent = styled(DialogContent as React.SFC<DialogContentProps>)`
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
        @media (max-width: 767px) {
            max-height: min-content;
            > :nth-child(2) {
                justify-content: flex-start;
                flex-grow: initial;
                > :nth-child(2) {
                    margin-top: 1rem;
                    display: flex;
                    > :first-child {
                        flex-grow: 1;
                    }
                }
            }
        }
    }
`;

const MainImageWrapper = styled.div`
    overflow: hidden;
`;

const MainImage = styled("img")`
    display: flex;
    cursor: pointer;
    transition: all .3s ease-out;
    :hover {
        transform: scale(1.2) rotate(${(props: { rotate: string }) => props.rotate}deg);
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
    min-height: 0;
    width: 100%;
    object-fit: cover;
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

const WorkTitle = styled(Typography as React.SFC<TypographyProps>)`
    && {
        margin-top: 1.5rem;
        font-size: 1.8rem;
        line-height: 1.8rem;
        letter-spacing: .1rem;
    }
`;
