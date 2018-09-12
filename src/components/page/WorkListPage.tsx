import React, { Fragment } from "react";
import AddIcon             from "@material-ui/icons/Add";
import gql                 from "graphql-tag";
import styled              from "styled-components";
import { Query }           from "react-apollo";
import getTagsByURLQueryParam   from "../../util/getTagsByURLQueryParam";
import { Work, WorkConnection } from "../../graphQL/type";
import { PageComponentProps }   from "./../../App";
import ErrorPage                from "../ErrorPage";
import Fab                      from "../Fab";
import Header                   from "../Header";
import NotFound                 from "../NotFound";
import Page                     from "../Page";
import WorkDialog               from "../WorkDialog";
import StreamSpinner            from "../StreamSpinner";
import WorkList                 from "../WorkList";

interface State {
    selectedWork?: Work;
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
    workDialogVisible: boolean;
    workListRow: number;
}

const QueryListWorks = gql(`
    query($limit: Int, $exclusiveStartKey: ID, $option: WorkQueryOption) {
        listWorks (
            limit: $limit,
            exclusiveStartKey: $exclusiveStartKey,
            option: $option
        ) {
            items {
                id
                imageUrl
                user {
                    displayName
                    message
                    avatarUri
                }
                title
                tags
                description
                createdAt
            }
            exclusiveStartKey
        }
    }
`);

export default class extends React.Component<PageComponentProps<{}>, State> {

    state = {
        selectedWork: undefined,
        userMenuAnchorEl: undefined,
        userMenuOpend: false,
        workDialogVisible: false,
        workListRow: 4,
    };

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

    componentWillMount() {
        console.log("componentWillMount on WorkListPage");
    }

    componentDidMount() {
        console.log("componentDidMount on WorkListPage");
        console.log(this.props);
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    componentDidUpdate() {}

    render() {

        const {
            auth,
            history,
            notificationListener,
        } = this.props;

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryListWorks}
                    variables={{
                        limit: 6,
                        exclusiveStartKey: null,
                        option: {
                            tags: getTagsByURLQueryParam(history)
                        }
                    }}
                    fetchPolicy="network-only"
                >
                    {({ data, loading, fetchMore, error }) => {
                        if (error)
                            return (
                                <Fragment>
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent message={error && error.message} key="error"/>
                                </Fragment>
                            );
                        else if (loading || !data.listWorks)
                            return (
                                <Host>
                                    <StreamSpinner
                                        disable={false}
                                        // tslint:disable-next-line:jsx-no-lambda
                                        onVisible={() => undefined}
                                    />
                                </Host>
                            );
                        else if (data.listWorks.items.length === 0 || !data.listWorks)
                            return <NotFound />;

                        const workConnection = data.listWorks as WorkConnection;

                        return(
                            <Host>
                                <WorkList
                                    works={workConnection.items}
                                    workListRow={this.state.workListRow}
                                    onWorkItemClick={this.handleClickOpen}
                                />
                                <WorkDialog
                                    history={history}
                                    open={this.state.workDialogVisible}
                                    onClose={this.handleClose}
                                    work={this.state.selectedWork}
                                />
                                <StreamSpinner
                                    key={`spinner-${workConnection && workConnection.exclusiveStartKey}-${getTagsByURLQueryParam(history).join("_")}`}
                                    disable={!workConnection.exclusiveStartKey ? true : false}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onVisible={() => {
                                        if (workConnection && workConnection.exclusiveStartKey)
                                            fetchMore<any>({
                                                variables: {
                                                    exclusiveStartKey: workConnection.exclusiveStartKey
                                                },
                                                updateQuery: (previousResult, { fetchMoreResult }) =>
                                                    previousResult.listWorks.items.length ? ({
                                                        listWorks: {
                                                            __typename: previousResult.listWorks.__typename,
                                                            items: (
                                                                [
                                                                    ...previousResult.listWorks.items,
                                                                    ...fetchMoreResult.listWorks.items
                                                                ].filter((x, i, self) => (
                                                                    self.findIndex(y => y.id === x.id) === i
                                                                ))
                                                            ),
                                                            exclusiveStartKey: fetchMoreResult.listWorks.exclusiveStartKey
                                                        }
                                                    })               : previousResult
                                            });
                                    }}
                                />
                            </Host>
                        );
                    }}
                </Query>
                <Fab
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => history.push("/works/create-work")}
                >
                    <AddIcon />
                </Fab>
            </Page>
        );
    }
}

const Host = styled.div`
    display: flex;
    flex-direction: column;
`;
