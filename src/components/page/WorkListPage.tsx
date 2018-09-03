import React, { Fragment } from "react";
import AddIcon             from "@material-ui/icons/Add";
import gql                 from "graphql-tag";
import styled              from "styled-components";
import { Query }           from "react-apollo";
import arraysEqual              from "../../util/arraysEqual";
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
    paginationKey?: string;
    selectedWork?: Work;
    tags: string[];
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
    workDialogVisible: boolean;
    works: Work[];
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
        paginationKey: undefined,
        selectedWork: undefined,
        tags: getTagsByURLQueryParam(this.props.history),
        userMenuAnchorEl: undefined,
        userMenuOpend: false,
        workDialogVisible: false,
        works: [] as Work[],
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

    toNext = (key: string) => this.setState({
        paginationKey: key
    })

    componentDidMount() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<PageComponentProps<{}>>) {
        const tags = getTagsByURLQueryParam(prevProps.history);
        if (!arraysEqual(this.state.tags, tags))
            this.setState({ tags, works: [] as Work[], paginationKey: undefined });
        return null;
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
                        limit: 12,
                        exclusiveStartKey: this.state.paginationKey,
                        option: {
                            tags: this.state.tags
                        }
                    }}
                    fetchPolicy="network-only"
                >
                    {({ loading, error, data }) => {
                        if (error || !data) {
                            console.error(error);
                            return (
                                <Fragment>
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent message={error && error.message} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!loading && this.state.works.length === 0 && data.listWorks.items.length === 0)
                            return <NotFound />;

                        const workConnection = data.listWorks as WorkConnection;
                        const works = this.state.works.concat(workConnection ? workConnection.items : [] as Work[]);

                        return(
                            <Host>
                                <WorkList
                                    works={works}
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
                                    key={`spinner-${workConnection && workConnection.exclusiveStartKey}`}
                                    disable={
                                        (workConnection && !workConnection.exclusiveStartKey)
                                     || (!loading && workConnection.exclusiveStartKey === this.state.paginationKey) ? true
                                      :                                                                               false
                                    }
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onVisible={() => {
                                        if (workConnection)
                                            this.setState({
                                                works,
                                                paginationKey: workConnection.exclusiveStartKey
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
