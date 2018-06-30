import React, { Fragment } from "react";
import {
    Query,
    Mutation
} from "react-apollo";
import styled from "styled-components";
import QueryGetUser from "../../GraphQL/query/QueryGetUser";
import MutationUpdateUser from "../../GraphQL/mutation/MutationUpdateUser";
import {
    Avatar,
    Button,
    TextField
} from "@material-ui/core";
import { PageComponentProps } from "../../App";
import NotFound from "../NotFound";

type Item = "displayName" | "email" | "career" | "message";

interface State {
    whileEditingItem: Item[];
    userEditing: boolean;
}

export default class extends React.Component<PageComponentProps<{}>, State> {

    displayNameInput?: any;

    componentWillMount() {
        this.setState({
            whileEditingItem: [],
            userEditing: false
        });
    }

    addWhileEditingItem = (item: Item) => (
        () => (
            !this.state.whileEditingItem.includes(item)
         && this.setState({ whileEditingItem: this.state.whileEditingItem.concat(item) })
        )
    )

    callUpdateUser = async (updateUser: Function, item: Item, value: any) => {
        try {
            await updateUser({
                variables: {
                    user: {
                        [item]: value,
                        id: this.props.auth.token!.payload.sub,
                    },
                    optimisticResponse: {
                        __typename: "Mutation",
                        createWork: {
                            id: "new",
                            userId: this.props.auth.token!.payload.sub,
                            createdAt: +new Date(),
                            __typename: "Work"
                        }
                    },
                }
            });
        } catch (err) {
            this.props.notificationListener.errorNotification(err);
        }
    }

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
                variables={{ id: auth.token!.payload.sub }}
                fetchPolicy="cache-and-network"
            >
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) {
                        console.error(error);
                        return (
                            <Fragment>
                                <div>cry；；</div>
                                <notificationListener.ErrorComponent error={error}/>
                            </Fragment>
                        );
                    }

                    if (!data.getUser)
                        return  <NotFound />;

                    const currentUser = data.getUser;

                    return (
                        <Mutation
                            mutation={MutationUpdateUser}
                            refetchQueries={[]}
                            // tslint:disable-next-line:jsx-no-lambda
                            update={(cache, { data: { user } }) => {
                                cache.writeQuery({
                                    query: QueryGetUser,
                                    data: { user }
                                });
                            }}
                        >
                            {(updateUser) => (
                                <Host>
                                    <div>
                                        <UserAvatar>
                                            HS
                                        </UserAvatar>
                                        <div>
                                            <TextField
                                                label="DisplayName"
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        this.state.whileEditingItem.includes("displayName")
                                                        && <Button
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() =>
                                                                this.callUpdateUser(
                                                                    updateUser,
                                                                    "displayName",
                                                                    this.displayNameInput.value
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                    ),
                                                }}
                                                onChange={this.addWhileEditingItem("displayName")}
                                                defaultValue={currentUser.displayName}
                                                fullWidth
                                                required
                                                // tslint:disable-next-line:jsx-no-lambda
                                                inputRef={x => this.displayNameInput = x}
                                            />
                                            <TextField
                                                id="profile-email"
                                                label="Mail Address"
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        this.state.whileEditingItem.includes("email")
                                                    && <Button>Save</Button>
                                                    ),
                                                }}
                                                onChange={this.addWhileEditingItem("email")}
                                                defaultValue={currentUser.email}
                                                fullWidth
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <TextField
                                            id="profile-career"
                                            label="Career"
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: (
                                                    this.state.whileEditingItem.includes("career")
                                                 && <Button>Save</Button>
                                                ),
                                            }}
                                            onChange={this.addWhileEditingItem("career")}
                                            defaultValue={currentUser.career}
                                            multiline
                                            rows={4}
                                        />
                                        <TextField
                                            id="profile-message"
                                            label="Message"
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: (
                                                    this.state.whileEditingItem.includes("message")
                                                 && <Button>Save</Button>
                                                ),
                                            }}
                                            onChange={this.addWhileEditingItem("message")}
                                            defaultValue={currentUser.message}
                                        />
                                    </div>
                                </Host>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

const Host = styled.form`
    width: 40rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    > :nth-child(1) {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 1rem;
        @media (max-width: 768px) {
            flex-direction: column;
        }
        > :nth-child(2) {
            flex-grow: 1;
        }
    }
    > :nth-child(2) {
        display: flex;
        flex-direction: column;
    }
    @media (max-width: 768px) {
        width: unset;
        margin: 0 4rem;
    }
`;

const UserAvatar = styled(Avatar)`
    && {
        width: 8rem;
        height: 8rem;
        margin: 1rem;
    }
`;
