import {
    withTheme,
    Checkbox,
    Collapse,
    Divider,
    List,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import { ListProps } from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageIcon from "@material-ui/icons/Language";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import SettingsIcon from "@material-ui/icons/Settings";
// import StarIcon from "@material-ui/icons/Star";
import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Link from "src/components/atoms/Link";
import LocationText from "src/components/atoms/LocationText";
import LocalizationContext, { LocalizationValue } from "src/contexts/LocalizationContext";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import RouterHistoryContext, { RouterHistoryValue } from "src/contexts/RouterHistoryContext";
import { PopularTags } from "src/graphQL/type";
import deduplicationFromArray from "src/util/deduplicationFromArray";
import formatTagsOfURLQueryParam from "src/util/formatTagsOfURLQueryParam";
import getTagsByURLQueryParam from "src/util/getTagsByURLQueryParam";
import isSubset from "src/util/isSubset";
import styled from "styled-components";

export default React.forwardRef((props, ref) => (
    <RouterHistoryContext.Consumer>
        {routerHistory => (
            <LocalizationContext.Consumer>
                {localization => (
                    <NotificationContext.Consumer>
                        {notification => (
                            <Navigator
                                routerHistory={routerHistory}
                                localization={localization}
                                notification={notification}
                                {...props}
                                ref={ref as any}
                            />
                        )}
                    </NotificationContext.Consumer>
                )}
            </LocalizationContext.Consumer>
        )}
    </RouterHistoryContext.Consumer>
));

interface State {
    tagListVisible: boolean;
    tags: string[];
}

interface Props {
    routerHistory: RouterHistoryValue;
    localization: LocalizationValue;
    notification: NotificationValue;
}

const QueryListPopularTags = gql(`
    query {
        listPopularTags {
            name
            count
        }
    }
`);

// https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
// After corresponding to getSnapshotBeforeUpdate of React Hooks, migrate to React Hooks
class Navigator extends React.Component<Props, State> {

    state: State = {
        tagListVisible: true,
        tags: getTagsByURLQueryParam(this.props.routerHistory.history)
    };

    componentDidUpdate() {}

    getSnapshotBeforeUpdate() {
        const tags = getTagsByURLQueryParam(this.props.routerHistory.history);
        if (!isSubset(tags, this.state.tags))
            this.setState({ tags: deduplicationFromArray(this.state.tags.concat(tags)) });
        return null;
    }

    toggleTagListVisible = () => this.setState({ tagListVisible: !this.state.tagListVisible });

    render() {

        const {
            routerHistory: {
                history
            },
            localization: {
                handleLocale
            },
            notification,
            ...props
        } = this.props;

        return (
            <Host {...props}>
                <Title variant="h2">
                    <Link to="/">
                        PORTAL
                    </Link>
                </Title>
                <Divider/>
                <List
                    subheader={<ListSubheader component="div"><LocationText text="Works"/></ListSubheader>}
                >
                    {/* TODO: Not work */}
                    {/* <Link
                        to="/works/popular"
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <StarIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <StyledText
                                        selected={history.location.pathname === "/works/popular"}
                                    >
                                        <LocationText text="Popular"/>
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link> */}
                    <Link to="/works/new">
                        <ListItem button>
                            <ListItemIcon>
                                <NewReleasesIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <StyledText
                                        selected={history.location.pathname === "/works/new"}
                                    >
                                        <LocationText text="New"/>
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
                            <ColorLensIcon/>
                        </ListItemIcon>
                        <ListItemText primary={<LocationText text="Tags"/>}/>
                        {this.state.tagListVisible ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                    </ListItem>
                    <Collapse in={this.state.tagListVisible} timeout="auto" unmountOnExit>
                        <Query
                            query={QueryListPopularTags}
                            fetchPolicy="cache-and-network"
                        >
                            {({ loading, error, data }) => {
                                if (loading) return <GraphQLProgress/>;
                                if (error) {
                                    console.error(error);
                                    return (
                                        <Fragment>
                                            <NestedListItem>
                                                <ListItemText
                                                    primary={<span style={{ color: "red" }}>Error</span>}
                                                />
                                            </NestedListItem>
                                            <notification.ErrorComponent error={error}/>
                                        </Fragment>
                                    );
                                }

                                const tags = getTagsByURLQueryParam(this.props.routerHistory.history);
                                const popularTags = (data.listPopularTags as PopularTags).map(x => x.name);

                                return (
                                    <TagList disablePadding>
                                        {popularTags.concat(this.state.tags)
                                            .filter((x, i, self) => self.indexOf(x) === i)
                                            .map(tag => (
                                                <Link
                                                    to={
                                                        (location.pathname.indexOf("/works") === -1 ? "/works" : "")
                                                      + formatTagsOfURLQueryParam(
                                                            tags.includes(tag) ? tags.filter(x => x !== tag)
                                                          :                      tags.concat(tag)
                                                        )
                                                    }
                                                    key={tag}
                                                >
                                                    <NestedListItem button>
                                                        <ListItemText
                                                            primary={<span>{tag}</span>}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Checkbox
                                                                checked={tags.includes(tag)}
                                                                tabIndex={-1}
                                                                disableRipple
                                                            />
                                                        </ListItemSecondaryAction>
                                                    </NestedListItem>
                                                </Link>
                                            )
                                        )}
                                    </TagList>
                                );
                            }}
                        </Query>
                    </Collapse>
                </List>
                {/* TODO: Not work */}
                {/* <List
                    subheader={<ListSubheader component="div">{locationText["Designer"]}</ListSubheader>}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon/>
                        </ListItemIcon>
                        <ListItemText primary={locationText["Popular"]}/>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <NewReleasesIcon/>
                        </ListItemIcon>
                        <ListItemText primary={locationText["New"]}/>
                    </ListItem>
                </List> */}
                <BottomList>
                    <Divider/>
                    <List>
                        <ListItem
                            button
                            onClick={handleLocale}
                        >
                            <ListItemIcon>
                                <LanguageIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                <LocationText text="Language"/>
                            </ListItemText>
                        </ListItem>
                        <Link
                            to="/settings"
                        >
                            <ListItem
                                button
                            >
                                <ListItemIcon>
                                    <SettingsIcon/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <StyledText
                                            selected={history.location.pathname === "/settings"}
                                        >
                                            <LocationText text="Settings"/>
                                        </StyledText>
                                    }
                                />
                            </ListItem>
                        </Link>
                    </List>
                </BottomList>
            </Host>
        );
    }
}

const Host = styled.div`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 2rem);
    max-height: calc(100vh - 2rem);
    width: 15rem;
    overflow: auto;
    margin: 1rem;
    box-sizing: border-box;
`;

const BottomList = styled.div`
    display: flex;
    flex-direction: column;
    min-height: max-content;
    margin-top: auto;
`;

const Title = styled(Typography as React.SFC<TypographyProps>)`
    && {
        font-size: 2rem;
        padding-top: 1.5rem;
        padding-bottom: 1rem;
        text-align: center;
        letter-spacing: .4rem;
    }
`;

const TagList = styled(List as React.SFC<ListProps>)`
    && {
        overflow: auto;
        max-height: 50vh;
    }
`;

const NestedListItem = styled(ListItem as React.SFC<ListItemProps>)`
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
