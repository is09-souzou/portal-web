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
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
}from "@material-ui/icons";

export default class extends React.Component {
    state = {
        worksTypeListVisible: false
    }

    render() {
        return (
            <div
                style={{
                    width: "15rem"
                }}
            >
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
                        <ListItemText primary="Popularity" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary="New" />
                    </ListItem>
                    <ListItem button onClick={() => this.setState({worksTypeListVisible: !this.state.worksTypeListVisible})}>
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
                        <ListItemText primary="Popularity" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary="New" />
                    </ListItem>
                </List>
            </div>
        );
    }
};

const Title = styled(Typography)`
    padding-top: 2.5rem;
    padding-bottom: .5rem;
    text-align: center;
    letter-spacing: .4rem;
`;

const NestedListItem = styled(ListItem)`
    paddingLeft: 1rem;
`