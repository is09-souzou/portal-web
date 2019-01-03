import { Divider, Tabs, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link";
import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import Fab from "src/components/atoms/Fab";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Page from "src/components/atoms/Page";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import WorkList from "src/components/atoms/WorkList";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import ViewPager from "src/components/organisms/ViewPager";
import WorkDialog from "src/components/organisms/WorkDialog";
import Footer from "src/components/pages/UserPage/Footer";
import Host from "src/components/pages/UserPage/Host";
import SkillTag from "src/components/pages/UserPage/SkillTag";
import StyledTab from "src/components/pages/UserPage/StyledTab";
import StyledTypography from "src/components/pages/UserPage/StyledTypography";
import UserAvatar from "src/components/pages/UserPage/UserAvatar";
import UserContent from "src/components/pages/UserPage/UserContent";
import UserPageHeader from "src/components/pages/UserPage/UserPageHeader";
import WorkContent from "src/components/pages/UserPage/WorkContent";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import { LocaleContext } from "src/components/wrappers/MainLayout";
import { User, Work, WorkConnection } from "src/graphQL/type";
import { PageComponentProps } from "src/App";

interface State {
    selectedWork?: Work;
    userWorks: Work[];
    workDialogVisible: boolean;
    workListRow: number;
    selectedIndex: number;
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
            skillList
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
                exclusiveStartKey
            }
        }
    }
`);

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>, State> {

    state: State = {
        selectedWork: undefined,
        workDialogVisible: false,
        userWorks: [] as Work[],
        workListRow: 4,
        selectedIndex: 0
    };

    componentDidMount() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
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

    handleContentType = (content: "user" | "work") => () => {
        if (content === "user") {
            this.props.history.push("?content=user");
            this.setState({ selectedIndex: 0 });
        } else {
            this.props.history.push("?content=work");
            this.setState({ selectedIndex: 1 });
        }
    }

    handleWorkListWorkItemClick = (x: Work) => () => this.setState({
        workDialogVisible: true,
        selectedWork: x,
    })

    handleCloseWorkDialog = () => this.setState({ workDialogVisible: false });

    handleStreamSpinnerVisible = (
        workConnection: WorkConnection,
        fetchMore: (<K extends "id" | "limit" | "exclusiveStartKey">(fetchMoreOptions: FetchMoreQueryOptions<{
            id: string;
            limit: number;
            exclusiveStartKey: null;
        }, K> & FetchMoreOptions<any, {
            id: string;
            limit: number;
            exclusiveStartKey: null;
        }>) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
            query: DocumentNode;
        } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>)
    ) => () => {
        if (workConnection && workConnection.exclusiveStartKey) {
            fetchMore<any>({
                variables: {
                    exclusiveStartKey: workConnection.exclusiveStartKey
                },
                updateQuery: (previousResult, { fetchMoreResult }) =>
                    previousResult.getUser.works.items ? ({
                        getUser: {
                            ...previousResult.getUser,
                            works: {
                                ...previousResult.getUser.works,
                                items: (
                                    [
                                        ...previousResult.getUser.works.items,
                                        ...fetchMoreResult.getUser.works.items
                                    ].filter((x, i, self) => (
                                        self.findIndex(y => y.id === x.id) === i
                                    ))
                                ),
                                exclusiveStartKey: fetchMoreResult.getUser.works.exclusiveStartKey
                            }
                        }
                    })               : previousResult
            });
        }
    }

    moveProfilePage = () => this.props.history.push("/profile");

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        const queryParam = toObjectFromURIQuery(this.props.history.location.search);
        const contentType = queryParam ? queryParam["content"]
                          :              "user";

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryGetUser}
                    variables={{ id: this.props.computedMatch!.params.id, limit: 6, exclusiveStartKey: null }}
                    fetchPolicy="network-only"
                >
                    {({ loading, error, data, fetchMore }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            return (
                                <Fragment>
                                    <ErrorTemplate/>
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
                            <LocaleContext.Consumer>
                                {({ locale }) => (
                                    <Host>
                                        <UserPageHeader>
                                            <img
                                                src={user.avatarUri}
                                            />
                                            <div>
                                                <UserAvatar
                                                    src={user.avatarUri}
                                                />
                                                <div>
                                                    <StyledTypography gutterBottom>
                                                        {user.displayName}
                                                    </StyledTypography>
                                                    <StyledTypography>
                                                        {user.email}
                                                    </StyledTypography>
                                                </div>
                                                <Tabs
                                                    value={contentType}
                                                    indicatorColor="primary"
                                                    textColor="primary"
                                                >
                                                    <StyledTab
                                                        disableRipple
                                                        label={locale.tab.profile}
                                                        value="user"
                                                        onClick={this.handleContentType("user")}
                                                    />
                                                    <StyledTab
                                                        disableRipple
                                                        label={locale.tab.workList + ("(") + userWorks.length + (")")}
                                                        value="work"
                                                        onClick={this.handleContentType("work")}
                                                    />
                                                </Tabs>
                                            </div>
                                        </UserPageHeader>
                                        <Divider />
                                        <ViewPager
                                            selectedIndex={this.state.selectedIndex}
                                        >
                                            <UserContent>
                                                <div>
                                                    <Typography gutterBottom variant="caption">
                                                        {locale.profile.message}
                                                    </Typography>
                                                    <StyledTypography gutterBottom>
                                                        {user.message}
                                                    </StyledTypography>
                                                </div>
                                                <div>
                                                    <Typography gutterBottom variant="caption">
                                                        {locale.profile.career}
                                                    </Typography>
                                                    <StyledTypography gutterBottom>
                                                        {user.career}
                                                    </StyledTypography>
                                                </div>
                                                <div>
                                                    <Typography gutterBottom variant="caption">
                                                        {locale.profile.skill}
                                                    </Typography>
                                                    {user.skillList && user.skillList.map(x =>
                                                        <SkillTag key={x}>{x}</SkillTag>
                                                    )}
                                                </div>
                                            </UserContent>
                                            <WorkContent>
                                                <WorkList
                                                    works={userWorks}
                                                    workListRow={this.state.workListRow}
                                                    onWorkItemClick={this.handleWorkListWorkItemClick}
                                                />
                                                <WorkDialog
                                                    history={history}
                                                    open={this.state.workDialogVisible}
                                                    onClose={this.handleCloseWorkDialog}
                                                    work={this.state.selectedWork}
                                                    locale={locale.location}
                                                    userId={auth.token!.payload.sub}
                                                />
                                                <StreamSpinner
                                                    key={`spinner-${workConnection && workConnection.exclusiveStartKey}`}
                                                    disable={!workConnection.exclusiveStartKey ? true : false}
                                                    onVisible={this.handleStreamSpinnerVisible(workConnection, fetchMore)}
                                                />
                                            </WorkContent>
                                        </ViewPager>
                                        <Footer>
                                            <Tabs
                                                value={contentType}
                                                indicatorColor="primary"
                                                textColor="primary"
                                            >
                                                <StyledTab
                                                    disableRipple
                                                    label={locale.tab.profile}
                                                    value="user"
                                                    onClick={this.handleContentType("user")}
                                                />
                                                <StyledTab
                                                    disableRipple
                                                    label={locale.tab.workList + ("(") + userWorks.length + (")")}
                                                    value="work"
                                                    onClick={this.handleContentType("work")}
                                                />
                                            </Tabs>
                                        </Footer>
                                        <Fab
                                            style={{
                                                visibility: (
                                                    (auth.token && user.id === auth.token!.payload.sub) && contentType === "user" ? "visible" : "hidden"
                                                )
                                            }}
                                            onClick={this.moveProfilePage}
                                        >
                                            <EditIcon />
                                        </Fab>
                                    </Host>
                                )}
                            </LocaleContext.Consumer>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}
