import { Divider, Tabs, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { Query, QueryResult } from "react-apollo";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import Fab from "src/components/atoms/Fab";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import WorkList from "src/components/atoms/WorkList";
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
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import NotificationContext from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import { User, Work, WorkConnection } from "src/graphQL/type";

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

export default (props: React.Props<{}>) => {
    const auth = useContext(AuthContext);
    const notification = useContext(NotificationContext);

    return (
        <Query
            query={QueryGetUser}
            variables={{ id: auth.token!.payload.sub }}
            fetchPolicy="network-only"
        >
            {(query =>
                (
                    <Host
                        ref={props.ref as any}
                        {...props}
                    >
                        {
                            query.loading         ? <GraphQLProgress/>
                          : query.error           ? (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notification.ErrorComponent error={query.error}/>
                                </Fragment>
                            )
                          : !(query.data.getUser) ? <NotFound/>
                          :                   (
                                <UserPage
                                    auth={auth}
                                    query={query}
                                />
                            )
                        }
                    </Host>
                )
            )}
        </Query>
    );
};

interface Props extends React.Props<{}> {
    auth: AuthValue;
    query: QueryResult<any, {
        id: any;
    }>;
}

const UserPage = (
    {
        auth,
        query: {
            data,
            fetchMore
        }
    }: Props
) => {

    const [selectedWork, setSelectedWork] = useState<Work | undefined>(undefined);
    const [workDialogOpend, setWorkDialogOpen] = useState<boolean>(false);
    const [workListRow, setWorkListRow] = useState<number>(4);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const routerHistory = useContext(RouterHistoryContext);
    const localization = useContext(LocalizationContext);

    useEffect(
        () => {
            const resize = () => {
                const row = getRow();
                if (row !== workListRow)
                    setWorkListRow(row);
            };
            window.addEventListener("resize", resize);

            return () => window.removeEventListener("resize", resize);
        },
        []
    );

    const queryParam = toObjectFromURIQuery(routerHistory.history.location.search);
    const contentType = queryParam ? queryParam["content"]
                      :              "user";

    const user = data.getUser as User;
    const workConnection = user.works as WorkConnection;

    return (
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
                            label={localization.locationText.tab.profile}
                            value="user"
                            onClick={() => {
                                routerHistory.history.push("?content=user");
                                setSelectedIndex(0);
                            }}
                        />
                        <StyledTab
                            disableRipple
                            label={`localization.locationText.tab.workList(${workConnection.items.length})`}
                            value="work"
                            onClick={() => {
                                routerHistory.history.push("?content=work");
                                setSelectedIndex(1);
                            }}
                        />
                    </Tabs>
                </div>
            </UserPageHeader>
            <Divider />
            <ViewPager
                selectedIndex={selectedIndex}
            >
                <UserContent>
                    <div>
                        <Typography gutterBottom variant="caption">
                            {localization.locationText.profile.message}
                        </Typography>
                        <StyledTypography gutterBottom>
                            {user.message}
                        </StyledTypography>
                    </div>
                    <div>
                        <Typography gutterBottom variant="caption">
                            {localization.locationText.profile.career}
                        </Typography>
                        <StyledTypography gutterBottom>
                            {user.career}
                        </StyledTypography>
                    </div>
                    <div>
                        <Typography gutterBottom variant="caption">
                            {localization.locationText.profile.skill}
                        </Typography>
                        {user.skillList && user.skillList.map(x =>
                            <SkillTag key={x}>{x}</SkillTag>
                        )}
                    </div>
                </UserContent>
                <WorkContent>
                    <WorkList
                        works={workConnection.items}
                        workListRow={workListRow}
                        onWorkItemClick={(x: Work) => {
                            setWorkDialogOpen(true);
                            setSelectedWork(x);
                        }}
                    />
                    <WorkDialog
                        open={workDialogOpend}
                        onClose={() => setWorkDialogOpen(false)}
                        work={selectedWork}
                        userId={auth.token!.payload.sub}
                    />
                    <StreamSpinner
                        key={`spinner-${workConnection && workConnection.exclusiveStartKey}`}
                        disable={!workConnection.exclusiveStartKey ? true : false}
                        onVisible={handleStreamSpinnerVisible(workConnection, fetchMore)}
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
                        label={localization.locationText.tab.profile}
                        value="user"
                        onClick={() => {
                            routerHistory.history.push("?content=user");
                            setSelectedIndex(0);
                        }}
                    />
                    <StyledTab
                        disableRipple
                        label={`${localization.locationText.tab.workList}(${workConnection.items.length})`}
                        value="work"
                        onClick={() => {
                            routerHistory.history.push("?content=work");
                            setSelectedIndex(1);
                        }}
                    />
                </Tabs>
            </Footer>
            <Fab
                style={{
                    visibility: (
                        (auth.token && user.id === auth.token!.payload.sub) && contentType === "user" ? "visible" : "hidden"
                    )
                }}
                onClick={() => routerHistory.history.push("/profile")}
            >
                <EditIcon />
            </Fab>
        </Host>
    );
};

const getRow = () => (
    window.innerWidth > 767 ?
        window.innerWidth > 1020 ? 4
      : window.innerWidth > 840  ? 3
      :                            2
  :
        window.innerWidth > 600  ? 3
      : window.innerWidth > 480  ? 2
      :                            1
);

const handleStreamSpinnerVisible = (
    workConnection: WorkConnection,
    fetchMore: (<K extends "id">(fetchMoreOptions: FetchMoreQueryOptions<{
        id: any;
    }, K> & FetchMoreOptions<any, {
        id: any;
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
};
