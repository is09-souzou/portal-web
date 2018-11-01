import React, { Fragment } from "react";
import {
    Avatar,
    Typography,
    Divider,
    Tab,
    Tabs,
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
}

const QueryGetUser = gql(`
    query($id: ID!, $limit: Int, $exclusiveStartKey: ID) {
        getUser(id: $id) {
            id
            email
            displayName
            career
            avatarUri
            message
            skill
            works(limit: $limit, exclusiveStartKey: $exclusiveStartKey) {
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
    };

    handleContentType = (content: string) => () => {
        if (content === "user") {
            this.props.history.push("?content=user");
        } else {
            this.props.history.push("?content=work");
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
                    variables={{ id: this.props.computedMatch!.params.id, limit: 100, exclusiveStartKey: null }}
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
                                    <UserPageHeaderContent>
                                        <UserAvatar
                                            src={user.avatarUri}
                                        />
                                        <div>
                                            <Typography gutterBottom variant="subheading">
                                                {user.displayName}
                                            </Typography>
                                            <Typography variant="subheading">
                                                {user.email}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Tabs
                                                value={contentType}
                                                indicatorColor="primary"
                                                textColor="primary"
                                            >
                                                <StyledTab
                                                    disableRipple
                                                    label="Profile"
                                                    value="user"
                                                    onClick={this.handleContentType("user")}
                                                />
                                                <StyledTab
                                                    disableRipple
                                                    label="WorkList"
                                                    value="work"
                                                    onClick={this.handleContentType("work")}
                                                />
                                            </Tabs>
                                        </div>
                                    </UserPageHeaderContent>
                                </UserPageHeader>
                                <Divider />
                                <Content>
                                    <UserContent
                                        style={{
                                            transform: `translateX(${ contentType === "user" ? "0" : "-120" }%)`
                                        }}
                                    >
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Message
                                            </Typography>
                                            <StyledTypography gutterBottom variant="body1" align="justify">
                                                {user.message}
                                            </StyledTypography>
                                        </div>
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Career
                                            </Typography>
                                            <StyledTypography gutterBottom>
                                                {user.career}
                                            </StyledTypography>
                                        </div>
                                        <div>
                                            <Typography gutterBottom variant="caption">
                                                Skill
                                            </Typography>
                                            <StyledTypography gutterBottom>
                                                {user.skill}
                                            </StyledTypography>
                                        </div>
                                    </UserContent>
                                    <WorkContent
                                        style={{
                                            transform: `translateX(${ contentType === "user" ? "0" : "-120" }%)`
                                        }}
                                    >
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
                                </Content>
                            </Host>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

const Host = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
    transition: all .3s ease-out;
`;

const Content = styled.div`
    display: flex;
    overflow: hidden;
    > * {
        position: relative;
        overflow: scroll;
        max-width: 100%;
        min-width: 100%;
        transition: all .3s ease-out;
    }
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
    flex-direction: column;
    margin-left: 15vw;
    margin-top: 1rem;
    > :not(first-child) {
        margin-top: 1rem;
    }
`;

const UserPageHeader = styled.div`
    display: flex;
    flex-direction: column;
    > :last-child {
        display: flex;
        max-height: 5rem;
    }
`;

const UserPageHeaderImage = styled.img`
    height: 27vh;
    object-fit: cover;
`;

const UserPageHeaderContent = styled.div`
    display: flex;
    position: relative;
    margin-left: 5vw;
    align-items: center;
    > :first-child {
        margin-bottom: 5rem;
    }
    > :nth-child(2) {
        margin-left: 2rem;
    }
    > :last-child {
        margin-left: auto;
        margin-top: auto;
    }
`;

const StyledTab = styled(Tab)`
    && {
        > :hover {
            color: #ff9100;
        }
    }
`;

const StyledTypography = styled(Typography)`
    && {
        font-size: 1.2rem;
        margin-left: 1.5rem;
        white-space: pre-wrap;
        letter-spacing: .1rem;
    }
`;

const WorkContent = styled.div`
    margin-top: 2rem;
`;
