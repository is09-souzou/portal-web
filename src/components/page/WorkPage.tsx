import React, { Fragment } from "react";
import {
    Button,
    Card,
    CardActions,
    CardMedia,
    CardContent,
    Typography
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import gql                from "graphql-tag";
import styled             from "styled-components";
import { Query }          from "react-apollo";
import { PageComponentProps } from "./../../App";
import Fab                    from "../Fab";
import Header                 from "../Header";
import Page                   from "../Page";

interface State {
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
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
                imageUri
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
            userMenuOpend: false
        });
    }

    render() {

        const {
            auth,
            history,
            notificationListener
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
                        exclusiveStartKey: null,
                        option: {
                        }
                    }}
                >
                    {({ loading, error, data }) => {
                        if (loading) return "loading..." ;
                        if (error) {
                            console.error(error);
                            return (
                                <Fragment>
                                    <div>error</div>
                                    <notificationListener.ErrorComponent message={error.message} key="error"/>
                                </Fragment>
                            );
                        }
                        return(
                            <Host>
                                {data.listWorks.items.map((x: any) =>
                                    <StyledCard key={x.id}>
                                        <StyledCardMedia
                                            id={x.id}
                                            // tslint:disable-next-line:max-line-length
                                            image={(x.imageUri && x.imageUri.length !== 0) ? x.imageUri[0] : "https://s3-ap-northeast-1.amazonaws.com/is09-portal-image/system/broken-image.png"}
                                            title={x.title}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                Lizard
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary">
                                            Share
                                            </Button>
                                            <Button size="small" color="primary">
                                            Learn More
                                            </Button>
                                        </CardActions>
                                    </StyledCard>
                                )}
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
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
    && {
        margin: 1rem;
        min-width: 20rem;
        max-width: 30rem;
    }
`;

const StyledCardMedia = styled(CardMedia)`
    && {
        height: 0;
        padding-top: 56.25%;
    }
`;
