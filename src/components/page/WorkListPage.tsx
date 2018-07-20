import React, { Fragment } from "react";
import { Typography }     from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import gql                from "graphql-tag";
import styled             from "styled-components";
import { Query }          from "react-apollo";
import arraysEqual              from "../../util/arraysEqual";
import getTagsByURLQueryParam   from "../../util/getTagsByURLQueryParam";
import { PageComponentProps }   from "./../../App";
import ErrorPage                from "../ErrorPage";
import Fab                      from "../Fab";
import Header                   from "../Header";
import NotFound                 from "../NotFound";
import Page                     from "../Page";
import WorkDialog               from "../WorkDialog";
import StreamSpinner            from "../StreamSpinner";
import { Work, WorkConnection } from "../../graphQL/type";

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
                }
                title
                tags
                description
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
                                <WorkList>
                                    {[...Array(this.state.workListRow).keys()].map(x => (
                                        <div
                                            key={x}
                                            style={{
                                                width: `calc(100% / ${this.state.workListRow})`
                                            }}
                                        >
                                            {works
                                                .filter((_, i) => i % this.state.workListRow === x)
                                                .map(x => (
                                                    <WorkItem
                                                        work={x}
                                                        key={x.id}
                                                        onClick={this.handleClickOpen(x)}
                                                    />
                                                )
                                            )}
                                        </div>
                                    ))}
                                </WorkList>
                                <WorkDialog
                                    history={history}
                                    open={this.state.workDialogVisible}
                                    onClose={this.handleClose}
                                    work={this.state.selectedWork}
                                />
                                <StreamSpinner
                                    key={`spinner-${workConnection.exclusiveStartKey}`}
                                    disable={
                                        (workConnection && !workConnection.exclusiveStartKey)
                                     || (!loading && workConnection.exclusiveStartKey === this.state.paginationKey) ? true
                                      :                                                                               false
                                    }
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onVisible={() => {
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

const WorkList = styled.div`
    margin: 0 3rem;
    display: flex;
    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 1rem;
    }
`;

const WorkItemBase = styled.div`
    margin-bottom: 2rem;
    width: 100%;
`;

// extends React.HTMLAttributes<HTMLDivElement>
interface WorkItemProps extends React.HTMLAttributes<HTMLDivElement> {
    work: Work;
}

const WorkItem = ({
    work,
    ...props
}: WorkItemProps) => (
    <WorkItemBase
        {...props}
    >
        <WorkImage
            src={(
                work.imageUrl ? work.imageUrl
              :                 "/img/no-image.png"
            )}
        />
        <div>
            <Typography variant="caption">
                {work.user.displayName}
            </Typography>
            <Typography gutterBottom variant="title" component="h2">
                {work.title}
            </Typography>
        </div>
    </WorkItemBase>
);

const WorkImage = styled.img`
    width: 100%;
    border-radius: 8px;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    :hover {
        background-color: #fff;
        transform: scale(1.1);
        box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
    }
`;
