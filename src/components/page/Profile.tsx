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
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    ExpansionPanelActions,
    TextField,
    Typography,
    withTheme
} from "@material-ui/core";
import { PageComponentProps } from "../../App";
import NotFound from "../NotFound";

type Item = "displayName" | "email" | "career" | "message";

interface State {
    opendItem?: Item;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            opendItem: undefined,
        });
    }

    handleChange = (item: Item) => () => this.setState({
        opendItem: this.state.opendItem === item ? undefined : item,
    })

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
                                    <ExpansionPanel
                                        component="form"
                                        expanded={this.state.opendItem === "displayName"}
                                        onChange={this.handleChange("displayName")}
                                        // tslint:disable-next-line jsx-no-lambda
                                        onSubmit={async e => {
                                            e.preventDefault();

                                            const displayName = (e.target as any).elements["profile-DisplayName"].value;

                                            try {
                                                await Promise.all([
                                                    updateUser({
                                                        variables: {
                                                            user: {
                                                                displayName,
                                                                id: auth.token!.payload.sub,
                                                            },
                                                            optimisticResponse: {
                                                                __typename: "Mutation",
                                                                updateUser: {
                                                                    displayName,
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
                                            <Heading>DisplayName</Heading>
                                            <SecondaryHeading>{currentUser.displayName}</SecondaryHeading>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <TextField
                                                id="profile-DisplayName"
                                                label="DisplayName"
                                                margin="none"
                                                fullWidth
                                            />
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelActions>
                                            <Button
                                                color="primary"
                                                type="submit"
                                            >
                                                save
                                            </Button>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                    <ExpansionPanel
                                        component="form"
                                        expanded={this.state.opendItem === "email"}
                                        onChange={this.handleChange("email")}
                                        // tslint:disable-next-line jsx-no-lambda
                                        onSubmit={async e => {
                                            e.preventDefault();

                                            const email = (e.target as any).elements["profile-Email"].value;

                                            try {
                                                await Promise.all([
                                                    updateUser({
                                                        variables: {
                                                            user: {
                                                                email,
                                                                id: auth.token!.payload.sub,
                                                            },
                                                            optimisticResponse: {
                                                                __typename: "Mutation",
                                                                updateUser: {
                                                                    email,
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
                                            <Heading>Mail Address</Heading>
                                            <SecondaryHeading>{currentUser.email}</SecondaryHeading>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <TextField
                                                id="profile-Email"
                                                label="Mail Address"
                                                margin="none"
                                                fullWidth
                                            />
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelActions>
                                            <Button
                                                color="primary"
                                                type="submit"
                                            >
                                                save
                                            </Button>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                    <ExpansionPanel
                                        component="form"
                                        expanded={this.state.opendItem === "career"}
                                        onChange={this.handleChange("career")}
                                        // tslint:disable-next-line jsx-no-lambda
                                        onSubmit={async e => {
                                            e.preventDefault();

                                            const career = (e.target as any).elements["profile-Career"].value;

                                            try {
                                                await Promise.all([
                                                    updateUser({
                                                        variables: {
                                                            user: {
                                                                career,
                                                                id: auth.token!.payload.sub,
                                                            },
                                                            optimisticResponse: {
                                                                __typename: "Mutation",
                                                                updateUser: {
                                                                    career,
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
                                            <Heading>Career</Heading>
                                            <SecondaryHeading>{currentUser.career}</SecondaryHeading>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <TextField
                                                id="profile-Career"
                                                label="Career"
                                                margin="none"
                                                multiline
                                                rows="5"
                                                fullWidth
                                            />
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelActions>
                                            <Button
                                                color="primary"
                                                type="submit"
                                            >
                                                save
                                            </Button>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                    <ExpansionPanel
                                        component="form"
                                        expanded={this.state.opendItem === "message"}
                                        onChange={this.handleChange("message")}
                                        // tslint:disable-next-line jsx-no-lambda
                                        onSubmit={async e => {
                                            e.preventDefault();

                                            const message = (e.target as any).elements["profile-Message"].value;

                                            try {
                                                await Promise.all([
                                                    updateUser({
                                                        variables: {
                                                            user: {
                                                                message,
                                                                id: auth.token!.payload.sub,
                                                            },
                                                            optimisticResponse: {
                                                                __typename: "Mutation",
                                                                updateUser: {
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
                                            <Heading>Message</Heading>
                                            <SecondaryHeading>{currentUser.message}</SecondaryHeading>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <TextField
                                                id="profile-Message"
                                                label="Message"
                                                margin="none"
                                                fullWidth
                                            />
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelActions>
                                            <Button
                                                color="primary"
                                                type="submit"
                                            >
                                                save
                                            </Button>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                </Host>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

const Host = styled.div`
    margin: 1rem 4rem;
`;

const Heading = styled(Typography)`
    && {
        flex-basis: 33.33%;
        flex-shrink: 0;
    }
`;

const SecondaryHeadingBase = styled(Typography)`
    && {
        color: ${(props: any) => props.theme.palette.text.secondary};
    }
`;

const SecondaryHeading = withTheme()(
    (props: any) => <SecondaryHeadingBase {...props}/>
);
