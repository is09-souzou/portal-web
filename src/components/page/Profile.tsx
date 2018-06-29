import React from "react";
import {
    Query,
    Mutation
} from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import MutationUpdateUser from "../../GraphQL/mutation/MutationUpdateUser";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    TextField,
    Typography
} from "@material-ui/core";
import { PageComponentProps } from "../../App";
import NotFound from "../NotFound";

type Item = "user" | "work";

interface State {
    opendItem?: Item;
    userEditing: boolean;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            opendItem: "user",
            userEditing: false
        });
    }

    handleChange = (item: Item) => () => this.setState({
        opendItem: this.state.opendItem === item ? undefined : item,
    })

    userEditingStart = () => this.setState({ userEditing: true });

    userEditingEnd = () => this.setState({ userEditing: false });

    render() {
        const {
            auth,
            notificationListener
        } = this.props;

        if (!auth.token)
            return "";

        return (
            <Query
                query={QueryGetUser}
                variables={{ id: auth.token!.payload.sub }}
                fetchPolicy="cache-and-network"
            >
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) {
                        console.error(error);
                        return ([
                            <div key="page">cry；；</div>,
                            <notificationListener.ErrorComponent error={error} key="error"/>
                        ]);
                    }

                    if (!data.getUser)
                        return  <NotFound />;

                    const currentUser = data.getUser;

                    return (
                        <Mutation mutation={MutationUpdateUser} refetchQueries={[]}>
                            {updateUser => (
                                <Host>
                                    { this.state.userEditing ?
                                        <Card
                                            component="form"
                                            // tslint:disable-next-line jsx-no-lambda
                                            onSubmit={async e => {
                                                e.preventDefault();

                                                const displayName =
                                                (e.target as any).elements["profile-DisplayName"].value;
                                                const email = (e.target as any).elements["profile-Email"].value;
                                                const career = (e.target as any).elements["profile-Career"].value;
                                                const message = (e.target as any).elements["profile-Message"].value;

                                                try {
                                                    await Promise.all([
                                                        updateUser({
                                                            variables: {
                                                                user: {
                                                                    displayName,
                                                                    email,
                                                                    career,
                                                                    message,
                                                                    id: auth.token!.payload.sub,
                                                                },
                                                                optimisticResponse: {
                                                                    __typename: "Mutation",
                                                                    updateUser: {
                                                                        displayName,
                                                                        email,
                                                                        career,
                                                                        message,
                                                                        id: auth.token!.payload.sub,
                                                                        __typename: "User"
                                                                    }
                                                                }
                                                            }
                                                        })
                                                    ]);

                                                    await new Promise(resolve => setTimeout(() => resolve(), 60000));
                                                } catch (err) {
                                                    console.log(err);
                                                }

                                                location.reload();
                                            }}
                                        >
                                            <FlexDiv>
                                                <CardMedia>
                                                    <AvatarDiv>
                                                        <Typography gutterBottom>
                                                            Avatar
                                                        </Typography>
                                                        <UserAvatar>
                                                            HS
                                                        </UserAvatar>
                                                    </AvatarDiv>
                                                </CardMedia>
                                                <CardContent>
                                                    <ParsonalDiv>
                                                        <ParsonalTextField
                                                            id="profile-DisplayName"
                                                            label="DisplayName"
                                                            defaultValue={currentUser.displayName}
                                                            margin="none"
                                                            fullWidth
                                                        />
                                                        <ParsonalTextField
                                                            id="profile-Email"
                                                            label="Mail Address"
                                                            defaultValue={currentUser.email}
                                                            margin="none"
                                                            fullWidth
                                                        />
                                                        <ParsonalTextField
                                                            id="profile-Career"
                                                            label="Career"
                                                            defaultValue={currentUser.career}
                                                            margin="none"
                                                            fullWidth
                                                            multiline
                                                            rows="4"
                                                        />
                                                        <ParsonalTextField
                                                            id="profile-Message"
                                                            label="Message"
                                                            defaultValue={currentUser.message}
                                                            margin="none"
                                                            fullWidth
                                                        />
                                                    </ParsonalDiv>
                                                </CardContent>
                                            </FlexDiv>
                                            <StyledCardActions>
                                                <Button
                                                    onClick={this.userEditingEnd}
                                                >
                                                    cancel
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    save
                                                </Button>
                                            </StyledCardActions>
                                        </Card>
                                    :
                                        <Card>
                                            <FlexDiv>
                                                <CardMedia>
                                                    <AvatarDiv>
                                                        <Typography gutterBottom>
                                                            Avatar
                                                        </Typography>
                                                        <UserAvatar>
                                                            HS
                                                        </UserAvatar>
                                                    </AvatarDiv>
                                                </CardMedia>
                                                <CardContent>
                                                    <ParsonalDiv>
                                                        <Typography gutterBottom>
                                                            DisplayName
                                                        </Typography>
                                                        <ParsonalTypography gutterBottom>
                                                            {currentUser.displayName}
                                                        </ParsonalTypography>
                                                        <Typography gutterBottom>
                                                            Mail Address
                                                        </Typography>
                                                        <ParsonalTypography gutterBottom>
                                                            {currentUser.email}
                                                        </ParsonalTypography>
                                                        <Typography gutterBottom>
                                                            Career
                                                        </Typography>
                                                        <ParsonalTypography gutterBottom>
                                                            {currentUser.career}
                                                        </ParsonalTypography>
                                                        <Typography gutterBottom>
                                                            Message
                                                        </Typography>
                                                        <ParsonalTypography gutterBottom>
                                                            {currentUser.message}
                                                        </ParsonalTypography>
                                                    </ParsonalDiv>
                                                </CardContent>
                                            </FlexDiv>
                                            <StyledCardActions>
                                                <Button
                                                    color="primary"
                                                    onClick={this.userEditingStart}
                                                >
                                                    edit
                                                </Button>
                                            </StyledCardActions>
                                        </Card>
                                    }
                                </Host>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

const AvatarDiv = styled.div`
    display: block;
    margin-left: 4rem;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
`;

const Host = styled.div`
    margin: 1rem 4rem;
`;

const ParsonalDiv = styled.div`
    display: block;
    margin-left: 4rem;
`;

const ParsonalTextField = styled(TextField)`
    && {
        margin-bottom: 1rem
    }
`;

const ParsonalTypography = styled(Typography)`
    &&{
        margin-left: 1rem;
    }
`;

const StyledCardActions = styled(CardActions)`
    && {
        float: right;
    }
`;

const UserAvatar = styled(Avatar)`
    &&{
        width: 6rem;
        height: 6rem;
        margin: 1rem 1rem;
    }
`;
