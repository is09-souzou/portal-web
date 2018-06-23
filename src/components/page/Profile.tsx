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
                        return  <NotFound/>;

                    const currentUser = data.getUser;

                    return (
                        <Mutation mutation={MutationUpdateUser} refetchQueries={[]}>
                            {updateUser => (
                                <Host>
                                    <ExpansionPanel
                                        expanded={this.state.opendItem === "displayName"}
                                        onChange={this.handleChange("displayName")}
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
                                                // tslint:disable-next-line:jsx-no-lambda
                                                onClick={async () => {
                                                    await updateUser();
                                                }}
                                            >
                                                save
                                            </Button>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                    <ExpansionPanel
                                        expanded={this.state.opendItem === "email"}
                                        onChange={this.handleChange("email")}
                                    >
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Heading>Mail Address</Heading>
                                            <SecondaryHeading>{currentUser.displayName}</SecondaryHeading>
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
                                                // tslint:disable-next-line:jsx-no-lambda
                                                onClick={async () => {
                                                    await updateUser();
                                                }}
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

const Host = styled.form`
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
