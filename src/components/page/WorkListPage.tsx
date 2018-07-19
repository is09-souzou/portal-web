import React, { Fragment } from "react";
import { Typography }     from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import gql                from "graphql-tag";
import styled             from "styled-components";
import { Query }          from "react-apollo";
import arraysEqual              from "../../util/arraysEqual";
import getTagsByURLQueryParam   from "../../util/getTagsByURLQueryParam";
import { PageComponentProps }   from "./../../App";
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
                userId
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
        tags: [] as string[],
        userMenuAnchorEl: undefined,
        userMenuOpend: false,
        workDialogVisible: false,
        works: [] as Work[],
        workListRow: 3
    };

    handleClickOpen = (x: Work) => () => this.setState({
        workDialogVisible: true,
        selectedWork: x,
    })

    handleClose = () => this.setState({ workDialogVisible: false });

    toNext = (key: string) => this.setState({
        paginationKey: key
    })

    componentDidMount() {
        this.setState({
            tags: getTagsByURLQueryParam(this.props.history)
        });
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
                                    <div>error</div>
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
                                        >
                                            {works
                                                .filter((_, i) => i % 3 === x)
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
                                    disable={workConnection && !workConnection.exclusiveStartKey ? true : false}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onVisible={() => {
                                        const f = () => {
                                            if (!loading)
                                                this.setState({
                                                    works,
                                                    paginationKey: workConnection.exclusiveStartKey
                                                });
                                            else
                                                setTimeout(f, 1000);
                                        };
                                        f();
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
        width: calc(100% / 3);
        margin: 0 1rem;
    }
`;

const WorkItemBase = styled.div`
    margin-bottom: 2rem;
    width: 100%;
    > :first-child {
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        cursor: pointer;
        :hover {
            box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
        }
    }
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
            <Typography gutterBottom variant="headline" component="h2">
                {work.title}
            </Typography>
        </div>
    </WorkItemBase>
);

const WorkImage = styled.img`
    width: 100%;
`;
