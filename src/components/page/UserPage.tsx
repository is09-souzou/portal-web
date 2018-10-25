import React, { Fragment } from "react";
import {
    Avatar,
    Typography,
    Button
} from "@material-ui/core";
import gql                 from "graphql-tag";
import styled              from "styled-components";
import { Query }           from "react-apollo";
import toObjectFromURIQuery            from "../../api/toObjectFromURIQuery";
import { PageComponentProps }          from "../../App";
import { User, Work, WorkConnection }  from "../../graphQL/type";
import ErrorPage                       from "../ErrorPage";
import GraphQLProgress                 from "../GraphQLProgress";
import Header                          from "../Header";
import NotFound                        from "../NotFound";
import Page                            from "../Page";
import WorkDialog                      from "../WorkDialog";
import WorkList                        from "../WorkList";

interface State {
    selectedWork?: Work;
    userWorks: Work[];
    workDialogVisible: boolean;
    workListRow: number;
    height: number;
}

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
            career
            avatarUri
            message
            works(limit: 12) {
                items {
                    id
                    userId
                    imageUrl
                    title
                    user {
                        displayName
                        message
                        avatarUri
                    }
                    tags
                    description
                    createdAt
                }
            }
        }
    }
`);

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>, State> {

    state = {
        selectedWork: undefined,
        workDialogVisible: false,
        userWorks: [] as Work[],
        workListRow: 4,
        height: 6,
    };

    handleContentType = (content: string) => () => {
        if (content === "work") {
            this.props.history.push("?content=user");
            this.setState({ height: 6 });
        } else {
            this.props.history.push("?content=work");
            this.setState({ height: 0 });
        }
    }

    onResize = () => {
        const row = (
            window.innerWidth > 767 ?
                window.innerWidth > 1020 ? 4
              : window.innerWidth > 840  ? 3
              :                            2
          :
                window.innerWidth > 600  ? 3
              : window.innerWidth > 480  ? 2
              :                            1
        );
        if (row !== this.state.workListRow)
            this.setState({ workListRow: row });
    }

    handleClickOpen = (x: Work) => () => this.setState({
        workDialogVisible: true,
        selectedWork: x,
    })

    handleClose = () => this.setState({ workDialogVisible: false });

    componentDidMount() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        const queryParam = toObjectFromURIQuery(this.props.history.location.search);
        const contentType = queryParam ? queryParam["content"]
                                       : "user";

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryGetUser}
                    variables={{ id: this.props.computedMatch!.params.id }}
                    fetchPolicy="cache-and-network"
                >
                    {({ loading, error, data }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            return (
                                <Fragment>
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent error={error} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return <NotFound />;

                        const user = data.getUser as User;
                        const workConnection = user.works as WorkConnection;
                        const userWorks = this.state.userWorks.concat(workConnection ? workConnection.items : [] as Work[]);

                        return (
                            <Host>
                                <UserPageHeader>
                                    <UserPageHeaderImage
                                        src={user.avatarUri}
                                    />
                                    <div
                                        style={{
                                            height: `${this.state.height}rem`
                                        }}
                                    >
                                        <UserPageHeaderContent>
                                            <UserAvatar
                                                src={user.avatarUri}
                                            />
                                            <div>
                                                <StyledTypography>
                                                    {user.displayName}
                                                </StyledTypography>
                                                <StyledTypography>
                                                    {user.email}
                                                </StyledTypography>
                                            </div>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleContentType(contentType)}
                                            >
                                            { contentType === "user" ?
                                                "WorkList"
                                            :
                                                "Profile"
                                            }
                                            </Button>
                                        </UserPageHeaderContent>
                                    </div>
                                </UserPageHeader>
                                { contentType === "user" ?
                                    <UserContent>
                                        <div>
                                            <FollowInfomation>
                                                <div>
                                                    <Typography variant="body2">
                                                        Follow
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        1000
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="body2">
                                                        Follower
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        3500
                                                    </Typography>
                                                </div>
                                            </FollowInfomation>
                                            <div>
                                                <Typography variant="caption">
                                                    message
                                                </Typography>
                                                <StyledTypography variant="body1" align="justify">
                                                    {user.message}
                                                </StyledTypography>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <Typography variant="caption">
                                                    Description
                                                </Typography>
                                                <StyledTypography>
                                                    事柄を説明し、正確に伝達することを目的とする文章。叙情文・叙事文・叙景文などに対する語。
                                                </StyledTypography>
                                            </div>
                                            <div>
                                                <Typography variant="caption">
                                                    Career
                                                </Typography>
                                                <StyledTypography>
                                                    {user.career}
                                                </StyledTypography>
                                            </div>
                                        </div>
                                    </UserContent>
                                :
                                    <WorkContent>
                                        <WorkList
                                            works={userWorks}
                                            workListRow={this.state.workListRow}
                                            onWorkItemClick={this.handleClickOpen}
                                        />
                                        <WorkDialog
                                            history={history}
                                            open={this.state.workDialogVisible}
                                            onClose={this.handleClose}
                                            work={this.state.selectedWork}
                                        />
                                    </WorkContent>
                                }
                            </Host>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

const FollowInfomation = styled.div`
    display: flex;
    text-align: center;
    > :last-child {
        margin-left: 3vw;
    }
`;

const Host = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
`;

const UserAvatar = styled(Avatar)`
    && {
        border: 1px solid #ccc;
        width: 12rem;
        height: 12rem;
    }
`;

const UserContent = styled.div`
    display: flex;
    margin-top: 2rem;
    > :first-child {
        display: flex;
        flex-direction: column;
        margin-left: 5vw;
        width: 15vw;
        > :last-child {
            margin-top: 2rem;
        }
    }
    > :last-child {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        > :not(:first-child) {
            margin-top: 2rem;
        }
`;

const UserPageHeader = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    > :first-child {
        display: flex;
    }
    > :last-child {
        display: flex;
        position: relative;
        height: 6rem;
    }
`;

const UserPageHeaderImage = styled.img`
    height: 35vh;
    width: 100%;
    object-fit: cover;
`;

const UserPageHeaderContent = styled.div`
    display: flex;
    position: absolute;
    bottom: 0rem;
    margin-left: 3vw;
    > :not(:first-child) {
        margin-top: auto;
        margin-bottom: 2rem;
    }
    > :nth-child(2) {
        background-color: #fafbfd;
    }
    > :nth-child(3) {
        margin-left: 5rem;
    }
`;

const WorkContent = styled.div`
    margin-top: 2rem;
`;

const StyledTypography = styled(Typography)`
    && {
        font-size: 1rem;
        margin: 0 1rem 0 1rem;
        white-space: pre-wrap;
    }
`;
