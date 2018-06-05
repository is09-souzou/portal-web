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
    Typography
} from "@material-ui/core";

import {
    Star as StarIcon,
    NewReleases as NewReleasesIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
}from "@material-ui/icons";

export default class extends React.Component {
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
                            <NestedListItem button>
                                <ListItemText inset primary="type1" />
                            </NestedListItem>
                            <NestedListItem button>
                                <ListItemText inset primary="type2" />
                            </NestedListItem>
                            <NestedListItem button>
                                <ListItemText inset primary="type3" />
                            </NestedListItem>
                            <NestedListItem button>
                                <ListItemText inset primary="type4" />
                            </NestedListItem>
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
