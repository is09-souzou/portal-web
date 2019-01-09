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
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageIcon from "@material-ui/icons/Language";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import SettingsIcon from "@material-ui/icons/Settings";
import StarIcon from "@material-ui/icons/Star";
import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Link from "src/components/atoms/Link";
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
        tagListVisible: getTagsByURLQueryParam(this.props.routerHistory.history).length !== 0,
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
                locationText,
                handleLocale
            },
            notification,
            ...props
        } = this.props;

        return (
            <Host {...props}>
                <Title variant="h5">
                    <Link to="/">
                        PORTAL
                    </Link>
                </Title>
                <Divider/>
                <List
                    subheader={<ListSubheader component="div">{locationText.navigator.works}</ListSubheader>}
                >
                    <Link
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
                                        {locationText.navigator.popular}
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
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
                                        {locationText.navigator.new}
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
                        <ListItemText primary={locationText.navigator.tags}/>
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
                                    <List disablePadding>
                                        {popularTags.concat(this.state.tags)
                                            .filter((x, i, self) => self.indexOf(x) === i)
                                            .map(tag => (
                                                <Link
                                                    to={
                                                        (location.pathname.indexOf("/works") === -1 ? "/works" : "")
                                                        + formatTagsOfURLQueryParam(
                                                            tags.includes(tag) ? tags.filter(x => x !== tag)
                                                        :
                                                            tags.concat(tag)
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
                                    </List>
                                );
                            }}
                        </Query>
                    </Collapse>
                </List>
                <List
                    subheader={<ListSubheader component="div">{locationText.navigator.designer}</ListSubheader>}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon/>
                        </ListItemIcon>
                        <ListItemText primary={locationText.navigator.popular}/>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <NewReleasesIcon/>
                        </ListItemIcon>
                        <ListItemText primary={locationText.navigator.new}/>
                    </ListItem>
                </List>
                <div>
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
                                {locationText.navigator.language}
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
                                            {locationText.navigator.settings}
                                        </StyledText>
                                    }
                                />
                            </ListItem>
                        </Link>
                    </List>
                </div>
            </Host>
        );
    }
}

const Host = styled.div`
    display: flex;
    flex-direction: column;
    height: max-content;
    min-height: 100%;
    width: 15rem;
    overflow: auto;
    > :last-child {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-end;
        min-height: max-content;
    }
`;

const Title = styled(Typography as React.SFC<TypographyProps>)`
    && {
        padding-top: 2.5rem;
        padding-bottom: .5rem;
        text-align: center;
        letter-spacing: .4rem;
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
