import React, { Fragment } from "react";
import {
    Avatar,
    Typography
} from "@material-ui/core";
import gql                 from "graphql-tag";
import styled              from "styled-components";
import { Query }           from "react-apollo";
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

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryGetUser}
                    variables={{ id: this.props.match!.params.id }}
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
                                            {user.displayName}
                                        </div>
                                        <div>
                                            {user.email}
                                        </div>
                                    </div>
                                    <UserAvatar
                                        src={user.avatarUri}
                                    />
                                </UserHost>
                                <UserContent>
                                    <div>
                                        <div>
                                            <Typography variant="caption">
                                                Follow
                                            </Typography>
                                            <Typography variant="caption">
                                                Follower
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="caption">
                                                message
                                            </Typography>
                                            <StyledUserTypography variant="body1">
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
        background-color: rgba( 220, 220, 220, 0.55 );
        margin-left: 16rem;
        bottom: 1rem;
        position: absolute;
        z-index: 1;
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
    margin-top: 6rem;
    > :first-child{
        align-items: center;
        width: 17rem;
        display: inline-flex;
        flex-direction: column;
        justify-content: start;
        > :nth-child(1){
            display: flex;
            > :nth-child(n){
                margin-left: 1rem;
            }
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

const StyledUserTypography = styled(Typography)`
    && {
        white-space: pre;
    }
`;
