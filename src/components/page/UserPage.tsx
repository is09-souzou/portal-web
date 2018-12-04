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
import { LocaleContext }               from "../wrapper/MainLayout";
import ErrorPage                       from "../ErrorPage";
import GraphQLProgress                 from "../GraphQLProgress";
import Header                          from "../Header";
import NotFound                        from "../NotFound";
import Page                            from "../Page";
import StreamSpinner                   from "../StreamSpinner";
import ViewPager                       from "../ViewPager";
import WorkDialog                      from "../WorkDialog";
import WorkList                        from "../WorkList";

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

    state = {
        selectedWork: undefined,
        workDialogVisible: false,
        userWorks: [] as Work[],
        workListRow: 4,
        selectedIndex: 0,
    };

    handleContentType = (content: string) => () => {
        if (content === "user") {
            this.props.history.push("?content=user");
            this.setState({ selectedIndex: 0 });
        } else {
            this.props.history.push("?content=work");
            this.setState({ selectedIndex: 1 });
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
                    variables={{ id: this.props.computedMatch!.params.id, limit: 6, exclusiveStartKey: null }}
                    fetchPolicy="network-only"
                >
                    {({ loading, error, data, fetchMore }) => {
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
                                                    {locale.profile.carrer}
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
                                                onWorkItemClick={this.handleClickOpen}
                                            />
                                            <WorkDialog
                                                history={history}
                                                open={this.state.workDialogVisible}
                                                onClose={this.handleClose}
                                                work={this.state.selectedWork}
                                                locale={locale.location}
                                            />
                                            <StreamSpinner
                                                key={`spinner-${workConnection && workConnection.exclusiveStartKey}`}
                                                disable={!workConnection.exclusiveStartKey ? true : false}
                                                // tslint:disable-next-line:jsx-no-lambda
                                                onVisible={() => {
                                                    if (workConnection && workConnection.exclusiveStartKey)
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
                                                }}
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

const Host = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
    transition: all .3s ease-out;
`;

const Footer = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    visibility: hidden;
    @media (max-width: 768px) {
        visibility: visible;
    }
`;

const UserAvatar = styled(Avatar)`
    && {
        border: 1px solid #ccc;
        width: 10rem;
        height: 10rem;
        @media (max-width: 768px) {
            width: 6rem;
            height: 6rem;
        }
    }
`;

const UserContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    > * {
        margin: 1rem 0 1rem 6rem;
    }
    @media (max-width: 768px) {
        > * {
            margin-left: 1rem;
        }
    }
`;

const UserPageHeader = styled.div`
    display: flex;
    flex-direction: column;
    > :first-child {
        height: 10rem;
        object-fit: cover;
    }
    > :last-child {
        display: flex;
        height: 5rem;
        align-items: center;
        margin-left: 5rem;
        > :first-child {
            margin-bottom: 5rem;
        }
        > :last-child {
            margin-top: auto;
            margin-left: auto;
            visibility: visible;
        }
        @media (max-width: 768px) {
            margin-left: 1rem;
            > :last-child {
                visibility: hidden;
            }
        }
    }
`;

const StyledTab = styled(Tab)`
    && {
        width: 50%;
        > :hover {
            color: #ff9100;
        }
    }
`;

const StyledTypography = styled(Typography)`
    && {
        font-size: 1.1rem;
        margin-left: 1.5rem;
        white-space: pre-wrap;
        letter-spacing: .1rem;
    }
`;

const SkillTag = styled.div`
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

const WorkContent = styled.div`
    padding: 3rem 0 1.5rem;
`;
