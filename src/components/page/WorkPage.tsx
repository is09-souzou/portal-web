import React, { Fragment } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import gql                from "graphql-tag";
import styled             from "styled-components";
import { Query }          from "react-apollo";
import { PageComponentProps }   from "./../../App";
import Fab                      from "../Fab";
import Header                   from "../Header";
import Page                     from "../Page";
import WorkDialog               from "../WorkDialog";
import StreamSpinner            from "../StreamSpinner";
import { Work, WorkConnection } from "../../graphQL/type";

interface State {
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
    workDialogVisible: boolean;
    works: Work[];
    selectedWork?: Work;
    paginationKey?: string;
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
                userId
                title
                tags
                imageUris
                description
            }
            exclusiveStartKey
        }
    }
`);

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false,
            workDialogVisible: false,
            paginationKey: undefined,
            works: [] as Work[]
        });
    }

    handleClickOpen = (x: Work) => () => this.setState({
        workDialogVisible: true,
        selectedWork: x,
    })

    handleClose = () => this.setState({ workDialogVisible: false });

    toNext = (key: string) => this.setState({
        paginationKey: key
    })

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
                        limit: 3,
                        // limit: 12,
                        exclusiveStartKey: this.state.paginationKey,
                        option: {
                        }
                    }}
                    fetchPolicy="cache-and-network"
                >
                    {({ error, data }) => {
                        if (error) {
                            console.error(error);
                            return (
                                <Fragment>
                                    <div>error</div>
                                    <notificationListener.ErrorComponent message={error.message} key="error"/>
                                </Fragment>
                            );
                        }

                        const workConnection = data && data.listWorks as WorkConnection;
                        const works = this.state.works.concat(workConnection ? workConnection.items : [] as Work[]);

                        return(
                            <Host>
                                <CardList>
                                    {works.map(x =>
                                        <WorkCard
                                            key={x.id}
                                            onClick={this.handleClickOpen(x)}
                                        >
                                            <WorkCardMedia
                                                image={(
                                                    (x.imageUris && x.imageUris.length as number !== 0) ? x.imageUris[0]
                                                    // tslint:disable-next-line:max-line-length
                                                :                                                         "https://s3-ap-northeast-1.amazonaws.com/is09-portal-image/system/broken-image.png"
                                                )}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="headline" component="h2">
                                                    {x.title}
                                                </Typography>
                                            </CardContent>
                                        </WorkCard>
                                    )}
                                </CardList>
                                <WorkDialog
                                    open={this.state.workDialogVisible}
                                    onClose={this.handleClose}
                                    work={this.state.selectedWork}
                                />
                                <StreamSpinner
                                    disable={workConnection && !workConnection.exclusiveStartKey ? true : false}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onVisible={() => this.setState({
                                        works: this.state.works.concat(workConnection.items),
                                        paginationKey: workConnection.exclusiveStartKey
                                    })}
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

const CardList = styled.div`
    margin: 0 3rem;
    display: flex;
    flex-wrap: wrap;
`;

const WorkCard = styled(Card)`
    && {
        margin: 1rem;
        min-width: 20rem;
        max-width: 30rem;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        cursor: pointer;
        :hover{
            box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
        }
    }
`;

const WorkCardMedia = styled(CardMedia)`
    && {
        height: 0;
        padding-top: 56.25%;
    }
`;
