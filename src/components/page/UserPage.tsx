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

    ContentTypeUser = () => this.props.history.push("?content=user");

    ContentTypeWork = () => this.props.history.push("?content=work");

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

        const queryParam = toObjectFromURIQuery(history.location.search);
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
                    variables={{ id: this.props.match!.params.id }}
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
                                <UserHeader>
                                    <div>
                                        <UserHeederImage
                                            src={user.avatarUri}
                                        />
                                    </div>
                                    <div>
                                        <UserHeaderContent>
                                            <div>
                                                <UserAvatar
                                                    src={user.avatarUri}
                                                />
                                            </div>
                                            <div>
                                                <StyledUserTypography>
                                                    {user.displayName}
                                                </StyledUserTypography>
                                                <StyledUserTypography>
                                                    {user.email}
                                                </StyledUserTypography>
                                            </div>
                                            <div>
                                                { contentType === "user" ?
                                                    <UserButton
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.ContentTypeWork}
                                                    >
                                                        Work List
                                                    </UserButton>
                                                :
                                                    <UserButton
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.ContentTypeUser}
                                                    >
                                                        Profile
                                                    </UserButton>
                                                }
                                            </div>
                                        </UserHeaderContent>
                                    </div>
                                </UserHeader>
                                { contentType === "user" ?
                                    <UserContent>
                                        <div>
                                            <div>
                                                <Typography variant="body2">
                                                    Follow
                                                </Typography>
                                                <Typography variant="body2">
                                                    Follower
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="body2">
                                                    1000
                                                </Typography>
                                                <Typography variant="body2">
                                                    3500
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption">
                                                    message
                                                </Typography>
                                                <StyledUserTypography variant="body1" align="justify">
                                                    {user.message}
                                                </StyledUserTypography>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <Typography variant="caption">
                                                    Description
                                                </Typography>
                                                <StyledUserTypography>
                                                    事柄を説明し、正確に伝達することを目的とする文章。叙情文・叙事文・叙景文などに対する語。
                                                </StyledUserTypography>
                                            </div>
                                            <div>
                                                <Typography variant="caption">
                                                    Career
                                                </Typography>
                                                <StyledUserTypography>
                                                    {user.career}
                                                </StyledUserTypography>
                                            </div>
                                        </div>
                                    </UserContent>
                                :
                                    <div>
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
                                    </div>
                                }
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
`;

const UserHeader = styled.div`
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

const UserHeederImage = styled.img`
    height: 35vh;
    width: 100%;
    object-fit: cover;
`;

const UserHeaderContent = styled.div`
    display: flex;
    position: absolute;
    bottom: 0rem;
    margin-left: 3vw;
    > :not(:first-child) {
        margin-top: auto;
        margin-bottom: 2rem;
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
    margin-top: 1rem;
    > :first-child{
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 17rem;
        justify-content: start;
        > :nth-child(-n + 2){
            display: flex;
            > :nth-child(n) {
                margin: 0 1rem 0 2rem;
            }
        }
        > :nth-child(3){
            margin-left: 2rem;
        }
    }
    > :nth-child(2){
        flex-grow: 1;
        min-height: 100%;
        :nth-child(n){
            bottom: -2rem;
            display: inline-grid;
            > :nth-child(n){
                margin: 0 0 1rem 0;
            }
        }
    }
`;

const UserButton = styled(Button)`
    $$ {
        bottom: 1rem;
        position: absolute;
        z-index: 1;
    }
`;

const StyledUserTypography = styled(Typography)`
    && {
        font-size: 1rem;
        margin: 0 1rem 0 1rem;
        white-space: pre-wrap;
    }
`;
