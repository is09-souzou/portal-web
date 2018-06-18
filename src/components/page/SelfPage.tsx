import React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
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

type Item = "displayName" | "email";

interface State {
    opendItem?: Item;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            opendItem: undefined
        });
    }

    handleChange = (item: Item) => () => this.setState({
        opendItem: this.state.opendItem === item ? undefined : item
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
                variables={{ id: auth.token.payload.sub }}
                fetchPolicy="cache-and-network"
            >
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) {
                        return ([
                            <div key="page">cry；；</div>,
                            <notificationListener.ErrorComponent error={error} key="error"/>
                        ]);
                    }

                    return (
                        <div>
                            <StyledPanel
                                expanded={this.state.opendItem === "displayName"}
                                onChange={this.handleChange("displayName")}
                            >
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        DisplayName
                                    </Typography>
                                </ExpansionPanelSummary>
                                <StyledPanelDetails>
                                    <StyledPersonalData>
                                        {data.getUser.name}
                                    </StyledPersonalData>
                                </StyledPanelDetails>
                                <Divider />
                                <StyledPanelActions>
                                    <Button color="primary">
                                        edit
                                    </Button>
                                </StyledPanelActions>
                            </StyledPanel>
                            <StyledPanel
                                expanded={this.state.opendItem === `email`}
                                onChange={this.handleChange("email")}
                            >
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        Email
                                    </Typography>
                                </ExpansionPanelSummary>
                                <StyledPanelDetails>
                                    <StyledPersonalData>
                                        {data.getUser.email}
                                    </StyledPersonalData>
                                </StyledPanelDetails>
                                <Divider />
                                <StyledPanelActions>
                                    <Button color="primary">
                                        edit
                                    </Button>
                                </StyledPanelActions>
                            </StyledPanel>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

const StyledPersonalData = styled(Typography)`
    && {
        margin-left: 2rem;
    }
`;
const StyledPanel = styled(ExpansionPanel)`
    && {
        margin-left: 3rem;
        min-width: 20rem;
        max-width: 90%;
    }
`;
const StyledPanelDetails = styled(ExpansionPanelDetails)`
    && {
        display: flex;
        flex-direction: column
    }
`;
const StyledPanelActions = styled(ExpansionPanelActions)`
    && {
        height: 1rem;
        padding-top: 2%;
    }
`;
const StyledTextField = styled(TextField)`
    && {
        margin-left: 2rem;
        width: 20rem;
    }
`;
