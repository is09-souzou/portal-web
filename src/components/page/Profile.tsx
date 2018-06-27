import React from "react";
import {
    Query,
    Mutation
} from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import MutationUpdateUser from "../../GraphQL/mutation/MutationUpdateUser";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import {
    Avatar,
    Button,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    ExpansionPanelActions,
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
                                        <ExpansionPanel
                                            component="form"
                                            expanded={this.state.opendItem === "user"}
                                            onChange={this.handleChange("user")}
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
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                <Heading>Parsonal Data</Heading>
                                            </ExpansionPanelSummary>
                                            <Divider />
                                            <ExpansionPanelDetails>
                                                <AvatarDiv>
                                                    <Typography gutterBottom>
                                                        Avatar
                                                    </Typography>
                                                    <UserAvatar>
                                                        HS
                                                    </UserAvatar>
                                                </AvatarDiv>
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
                                            </ExpansionPanelDetails>
                                            <Divider />
                                            <ExpansionPanelActions>
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
                                            </ExpansionPanelActions>
                                        </ExpansionPanel>
                                    :
                                        <ExpansionPanel
                                            expanded={this.state.opendItem === "user"}
                                            onChange={this.handleChange("user")}
                                        >
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                <Heading>Parsonal Data</Heading>
                                            </ExpansionPanelSummary>
                                            <Divider />
                                            <ExpansionPanelDetails>
                                                <AvatarDiv>
                                                    <Typography gutterBottom>
                                                        Avatar
                                                    </Typography>
                                                    <UserAvatar>
                                                        HS
                                                    </UserAvatar>
                                                </AvatarDiv>
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
                                            </ExpansionPanelDetails>
                                            <Divider />
                                            <ExpansionPanelActions>
                                                <Button
                                                    color="primary"
                                                    onClick={this.userEditingStart}
                                                >
                                                    edit
                                                </Button>
                                            </ExpansionPanelActions>
                                        </ExpansionPanel>
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
    && {
        display: block;
        margin-left: 1rem;
    }
`;

const ParsonalDiv = styled.div`
    && {
        display: block;
        margin-left: 4rem;
    }
`;

const Host = styled.div`
    && {
        margin: 1rem 4rem;
    }
`;

const Heading = styled(Typography)`
    && {
        flex-basis: 33.33%;
        flex-shrink: 0;
    }
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

const UserAvatar = styled(Avatar)`
    &&{
        width: 6rem;
        height: 6rem;
        margin: 1rem 1rem;
    }
`;
