import React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
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

type Item = "displayName" | "email" | "career" | "message";

interface State {
    opendItem?: Item;
    userEditing: boolean;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            opendItem: undefined,
            userEditing: false
        });
    }

    handleChange = (item: Item) => () => this.setState({
        opendItem: this.state.opendItem === item ? undefined : item,
        userEditing: false
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
                            {this.state.userEditing ?
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
                                        <StyledTextField
                                            id="self-name"
                                            defaultValue={data.getUser.name}
                                            margin="normal"
                                            required
                                        />
                                    </StyledPanelDetails>
                                    <Divider />
                                    <StyledPanelActions>
                                        <Button type="submit" color="primary" onClick={this.userEditingEnd}>
                                            save
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            :
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
                                        <Button color="primary" onClick={this.userEditingStart}>
                                            edit
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            }
                            <StyledPanel
                                expanded={this.state.opendItem === "email"}
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
                            <StyledPanel
                                expanded={this.state.opendItem === "career"}
                                onChange={this.handleChange("career")}
                            >
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        Career
                                    </Typography>
                                </ExpansionPanelSummary>
                                <StyledPanelDetails>
                                    <StyledPersonalData>
                                        {data.getUser.career}
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
                                expanded={this.state.opendItem === "message"}
                                onChange={this.handleChange("message")}
                            >
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        Message
                                    </Typography>
                                </ExpansionPanelSummary>
                                <StyledPanelDetails>
                                    <StyledPersonalData>
                                        {data.getUser.message}
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
