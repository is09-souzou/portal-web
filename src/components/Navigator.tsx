import React from "react";
import {
    Checkbox,
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
    withTheme,
} from "@material-ui/core";
import {
    ColorLens   as ColorLensIcon,
    ExpandLess  as ExpandLessIcon,
    ExpandMore  as ExpandMoreIcon,
    NewReleases as NewReleasesIcon,
    Star        as StarIcon
} from "@material-ui/icons";
import * as H               from "history";
import styled               from "styled-components";
import toObjectFromURIQuery from "../api/toObjectFromURIQuery";
import Link                 from "./Link";

interface Props {
    history: H.History;
}

interface State {
    tagListVisible: boolean;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            tagListVisible: false
        });
    }

    componentDidMount() {
        this.setState({
            tagListVisible: this.getTags(this.props.history).length !== 0
        });
    }

    getTags = (history: H.History) => {
        const queryParam = toObjectFromURIQuery(history.location.search);
        const tags = queryParam ? queryParam["tags"].split(",") : [];
        return queryParam && !(tags.length === 1 && tags[0] === "") ? queryParam["tags"].split(",") : [];
    }

    toggleTagListVisible = () => this.setState({ tagListVisible: !this.state.tagListVisible });

    render() {
        const {
            history
        } = this.props;

        const tags = this.getTags(history);

        return (
            <Host>
                <Title variant="headline">
                    PORTAL
                </Title>
                <Divider />
                <List
                    subheader={<ListSubheader component="div">Works</ListSubheader>}
                >
                    <Link
                        to="/works/popular"
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <StyledText
                                        selected={history.location.pathname === "/works/popular"}
                                    >
                                        Popular
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
                    <Link
                        to="/works/new"
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <NewReleasesIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <StyledText
                                        selected={history.location.pathname === "/works/new"}
                                    >
                                        New
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
                    <ListItem
                        button
                        onClick={this.toggleTagListVisible}
                    >
                        <ListItemIcon>
                            <ColorLensIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tags" />
                        {this.state.tagListVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={this.state.tagListVisible} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {tags.map(tag => (
                                <Link
                                    to={
                                        tags.length === 1 ? "/works"
                                                          : (
                                        "/works?tags="
                                      + tags.filter(x => tag !== x)
                                            .reduce((prev, next) => `${prev},${next}`, "")
                                            .slice(1, -1)
                                        )
                                    }
                                    key={tag}
                                >
                                    <NestedListItem button>
                                        <ListItemText
                                            primary={
                                                <StyledText
                                                    selected={history.location.pathname === `/works?tags=${tag}`}
                                                >
                                                    {tag}
                                                </StyledText>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                checked={tag}
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemSecondaryAction>
                                    </NestedListItem>
                                </Link>
                            ))}
                        </List>
                    </Collapse>
                </List>
                <List
                    subheader={<ListSubheader component="div">Designer</ListSubheader>}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary="Popular" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <NewReleasesIcon />
                        </ListItemIcon>
                        <ListItemText primary="New" />
                    </ListItem>
                </List>
            </Host>
        );
    }
}

const Host = styled.div`
    width: 15rem;
`;

const Title = styled(Typography)`
    padding-top: 2.5rem;
    padding-bottom: .5rem;
    text-align: center;
    letter-spacing: .4rem;
`;

const NestedListItem = styled(ListItem)`
    && {
        padding-left: 2rem;
    }
`;

const StyledSpan = styled.span`
    border-top: 1px;
    color: ${(props: any) => props.selected ? props.theme.palette.primary.main : "black"};
`;

const StyledText = withTheme()(
    (props: any) => <StyledSpan {...props}/>
);
