import React, { Fragment } from "react";
import {
    Avatar,
    Typography,
    Button
} from "@material-ui/core";
import gql                 from "graphql-tag";
import styled              from "styled-components";
import { Query }           from "react-apollo";
import toObjectFromURIQuery   from "../../api/toObjectFromURIQuery";
import { PageComponentProps } from "../../App";
import ErrorPage              from "../ErrorPage";
import GraphQLProgress        from "../GraphQLProgress";
import Header                 from "../Header";
import NotFound               from "../NotFound";
import Page                   from "../Page";
import { User }               from "../../graphQL/type";

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
            career
            avatarUri
            message
        }
    }
`);

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>> {

    ContentTypeUser = () => this.props.history.push("?content=user");

    ContentTypeWork = () => this.props.history.push("?content=work");

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        const queryParam = toObjectFromURIQuery(history.location.search);
        const contentType = queryParam ? queryParam["content"]
                                       : "user";

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryGetUser}
                    variables={{ id: this.props.computedMatch!.params.id }}
                    fetchPolicy="cache-and-network"
                >
                    {({ loading, error, data }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            return (
                                <Fragment>
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent error={error} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return <NotFound />;

                        const user = data.getUser as User;

                        return (
                            <Host>
                                <UserHost>
                                    <UserHedaerImage
                                        src={user.avatarUri}
                                    />
                                    <div>
                                        <div>
                                            <StyledUserTypography variant="body2">
                                                {user.displayName}
                                            </StyledUserTypography>
                                            <StyledUserTypography variant="body2">
                                                {user.email}
                                            </StyledUserTypography>
                                        </div>
                                        <div>
                                            { contentType === "user" ?
                                                <UserButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.ContentTypeWork}
                                                >
                                                    Work List
                                                </UserButton>
                                            :
                                                <UserButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.ContentTypeUser}
                                                >
                                                    Profile
                                                </UserButton>
                                            }
                                        </div>
                                    </div>
                                    <UserAvatar
                                        src={user.avatarUri}
                                    />
                                </UserHost>
                                { contentType === "user" ?
                                    <UserContent>
                                        <div>
                                            <div>
                                                <Typography variant="body2">
                                                    Follow
                                                </Typography>
                                                <Typography variant="body2">
                                                    Follower
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="body2">
                                                    1000
                                                </Typography>
                                                <Typography variant="body2">
                                                    3500
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption">
                                                    message
                                                </Typography>
                                                <StyledUserTypography variant="body1" align="justify">
                                                    {user.message}
                                                </StyledUserTypography>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <Typography variant="caption">
                                                    Description
                                                </Typography>
                                                <StyledUserTypography>
                                                    事柄を説明し、正確に伝達することを目的とする文章。叙情文・叙事文・叙景文などに対する語。
                                                </StyledUserTypography>
                                            </div>
                                            <div>
                                                <Typography variant="caption">
                                                    Career
                                                </Typography>
                                                <StyledUserTypography>
                                                    {user.career}
                                                </StyledUserTypography>
                                            </div>
                                        </div>
                                    </UserContent>
                                :
                                    <div>
                                        a
                                    </div>
                                }
                            </Host>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

const Host = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
`;

const UserHost = styled.div`
    position: relative;
    > :nth-child(2) {
        display: flex;
        margin-left: 17rem;
        top: 20rem;
        position: absolute;
        z-index: 1;
        > :nth-child(even) {
            margin-left: 1rem;
        }
    }
`;

const UserHedaerImage = styled.img`
    position: relative;
    height: 19rem;
    width: 100%;
    object-fit: cover;
`;

const UserAvatar = styled(Avatar)`
    && {
        position: absolute;
        bottom: -5rem;
        border: 1px solid #ccc;
        width: 12rem;
        height: 12rem;
        margin: 0 3rem;
    }
`;

const UserContent = styled.div`
    display: flex;
    margin-top: 7rem;
    > :first-child{
        align-items: center;
        width: 17rem;
        display: inline-flex;
        flex-direction: column;
        justify-content: start;
        > :nth-child(-n + 2){
            display: flex;
            > :nth-child(n) {
                margin: 0 1rem 0 2rem;
            }
        }
        > :nth-child(3){
            margin-left: 2rem;
        }
    }
    > :nth-child(2){
        flex-grow: 1;
        min-height: 100%;
        :nth-child(n){
            bottom: -2rem;
            display: inline-grid;
            > :nth-child(n){
                margin: 0 0 1rem 0;
            }
        }
    }
`;

const UserButton = styled(Button)`
    $$ {
        bottom: 1rem;
        position: absolute;
        z-index: 1;
    }
`;

const StyledUserTypography = styled(Typography)`
    && {
        font-size: 1rem;
        margin: 0 1rem 0 1rem;
        white-space: pre-wrap;
    }
`;
