import React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    TextField,
    Typography
} from "@material-ui/core"
// TODO ↑ セミコロン忘れ エディタにtslintの拡張いれてない？
import { PageComponentProps } from "../../App";

interface State {
    userEditing: boolean;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            userEditing: false
        });
    }

    userEditingStart = () => this.setState({ userEditing: true });

    userEditingEnd = () => this.setState({ userEditing: false });

    render() {
        const {
            auth,
            errorListener
        } = this.props;

        if (!auth.token)
            return "";

        return (
            <Query query={QueryGetUser} variables={{ id: auth.token.payload.sub }}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) {
                        return ([
                            <div key="page">cry；；</div>,
                            <errorListener.ErrorComponent error={error} key="error"/>
                        ]);
                    }

                    return (
                        <div>
                            {/* TODO  <StyledCard> は条件分岐によって変化ないので共通化していいかと　*/}
                            {/* TODO ↓ this.state.userEditing */}
                            {this.userEditing ?
                                <StyledCard>
                                    <CardContent>
                                        <Typography gutterBottom variant="display1" component="h2">
                                            Profile
                                        </Typography>
                                        <TextField
                                            id="self-name"
                                            label="DisplayName"
                                            value={data.getUser.name}
                                            margin="normal"
                                        />
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={this.userEditingEnd}>
                                            End
                                        </Button>
                                    </CardActions>
                                </StyledCard>
                            :
                                <StyledCard>
                                    <CardContent>
                                        <Typography gutterBottom variant="display1" component="h2">
                                            Profile
                                        </Typography>
                                        <StyledCardMedia
                                            image={data.getUser.avatorURI}
                                            title="avator"
                                        />
                                        <Typography gutterBottom variant="body1" component="label">
                                            DisplayName : {data.getUser.name}
                                        </Typography>
                                        <Typography gutterBottom variant="body1" component="label">
                                            Email : {data.getUser.email}
                                        </Typography>
                                        <Typography gutterBottom variant="body1" component="label">
                                            Carrer : {data.getUser.career}
                                        </Typography>
                                        <Typography gutterBottom variant="body1" component="label">
                                            Message : {data.getUser.messeage}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={this.userEditingStart}>
                                            Edit
                                        </Button>
                                    </CardActions>
                                </StyledCard>
                            }
                        </div>
                    );
                }}
            </Query>
        );
    }
}

const StyledCard = styled(Card)`
    && {
        margin: 1rem;
        min-width: 20rem;
        max-width: 100%;
    }
`;
const StyledCardMedia = styled(CardMedia)`
    && {
        height: 0;
        padding-top: 10%;
    }
`;
