import React from "react";
import styled from "styled-components";
import {
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
    withStyles,
    withTheme,
    WithTheme,
} from "@material-ui/core";

import {
    Star as StarIcon,
    NewReleases as NewReleasesIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from "@material-ui/icons";

import Link from "./Link";

export default class extends React.Component<{histroy: any}> {
    state = {
        worksTypeListVisible: false
    };

    toggleWorksTypeListVisible = () => this.setState({ worksTypeListVisible: !this.state.worksTypeListVisible });

    render() {
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
                                        selected={this.props.histroy.location.pathname === "/works/popular"}
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
                                        selected={this.props.histroy.location.pathname === "/works/new"}
                                    >
                                        New
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
                    <ListItem
                        button
                        onClick={this.toggleWorksTypeListVisible}
                    >
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary="Designer" />
                        {this.state.worksTypeListVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={this.state.worksTypeListVisible} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link
                                to="/works/type1"
                            >
                                <NestedListItem button>
                                    <ListItemText inset primary="type1" />
                                </NestedListItem>
                            </Link>
                            <Link
                                to="/works/type2"
                            >
                                <NestedListItem button>
                                    <ListItemText inset primary="type2" />
                                </NestedListItem>
                            </Link>
                            <Link
                                to="/works/type3"
                            >
                                <NestedListItem button>
                                    <ListItemText inset primary="type3" />
                                </NestedListItem>
                            </Link>
                            <Link
                                to="/works/type4"
                            >
                                <NestedListItem button>
                                    <ListItemText inset primary="type4" />
                                </NestedListItem>
                            </Link>
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
    paddingLeft: 1rem;
`;

const StyledSpan = styled.span`
    border-top: 1px;
    color: ${(props: any) => props.selected ? props.theme.palette.primary.main : "black"};
`;

const StyledText = withTheme()(
    (props: any) => <StyledSpan {...props}/>
);
