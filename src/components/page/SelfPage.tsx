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

interface State {
    userEditing: boolean;
    emailEditing: boolean;
    careerEditing: boolean;
    messageEditing: boolean;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            nameEditing: false,
            emailEditing: false,
            careerEditing: false,
            messageEditing: false
        });
    }

    nameEditingStart = () => this.setState({ nameEditing: true });
    nameEditingEnd = () => this.setState({ nameEditing: false });

    emailEditingStart = () => this.setState({ emailEditing: true });
    emailEditingEnd = () => this.setState({ emailEditing: false });

    careerEditingStart = () => this.setState({ careerEditing: true });
    careerEditingEnd = () => this.setState({ careerEditing: false });

    messageEditingStart = () => this.setState({ messageEditing: true });
    messageEditingEnd = () => this.setState({ messageEditing: false });

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
                            {/* StyledPanelの下に三項演算子を置くとなぜかAction要素でエラーを吐くため一時的にStylePanelの上に三項演算子を置いてます */}
                            {/* 解決策が見つかり次第修正します */}
                            {this.state.nameEditing ?
                                <StyledPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            DisplayName
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    <StyledPanelDetails>
                                        <StyledTextField
                                            required
                                            id="self-name"
                                            defaultValue={data.getUser.name}
                                            margin="normal"
                                        />
                                    </StyledPanelDetails>
                                    <Divider />
                                    <StyledPanelActions>
                                        <Button color="primary" onClick={this.nameEditingEnd}>
                                            Save
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            :
                                <StyledPanel>
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
                                        <Button color="primary" onClick={this.nameEditingStart}>
                                            Edit
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            }
                            {this.state.emailEditing ?
                                <StyledPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            Email
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    <StyledPanelDetails>
                                        <StyledTextField
                                            required
                                            id="self-email"
                                            defaultValue={data.getUser.email}
                                            margin="normal"
                                        />
                                    </StyledPanelDetails>
                                    <Divider />
                                    <StyledPanelActions>
                                        <Button color="primary" onClick={this.emailEditingEnd}>
                                            Save
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            :
                                <StyledPanel>
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
                                        <Button color="primary" onClick={this.emailEditingStart}>
                                            Edit
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            }
                            {this.state.careerEditing ?
                                <StyledPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            Career
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    <StyledPanelDetails>
                                        <StyledTextField
                                            required
                                            id="self-career"
                                            defaultValue={data.getUser.career}
                                            margin="normal"
                                        />
                                    </StyledPanelDetails>
                                    <Divider />
                                    <StyledPanelActions>
                                        <Button color="primary" onClick={this.careerEditingEnd}>
                                            Save
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            :
                                <StyledPanel>
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
                                        <Button color="primary" onClick={this.careerEditingStart}>
                                            Edit
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            }
                            {this.state.messageEditing ?
                                <StyledPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            Message
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    <StyledPanelDetails>
                                        <StyledTextField
                                            required
                                            id="self-message"
                                            defaultValue={data.getUser.message}
                                            margin="normal"
                                        />
                                    </StyledPanelDetails>
                                    <Divider />
                                    <StyledPanelActions>
                                        <Button color="primary" onClick={this.messageEditingEnd}>
                                            Save
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            :
                                <StyledPanel>
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
                                        <Button color="primary" onClick={this.messageEditingStart}>
                                            Edit
                                        </Button>
                                    </StyledPanelActions>
                                </StyledPanel>
                            }
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
