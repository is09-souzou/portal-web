import React, { ReactNode } from "react";
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import config from "./../../config";

interface PropsModel {
    render: (auth: any) => ReactNode;
}

interface StateModel {
    cognitoUserPool: CognitoUserPool;
    jwtToken: string | null;
    cognitoUser: CognitoUser | null;
}

export default class extends React.Component<PropsModel, StateModel> {

    state = {
        cognitoUserPool: new CognitoUserPool(config.cognito),
        jwtToken: null,
        cognitoUser: null
    };

    componentWillMount() {
        const cognitoUser = this.state.cognitoUserPool.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession((err: any, session: any) => {
                if (err) {
                    alert(err);
                    return;
                }
                this.setState({
                    cognitoUser,
                    jwtToken: session.accessToken.jwtToken
                });
            });
        }
    }

    render() {
        return this.props.render({
            auth: {
                signIn: (email: string, password: string) => new Promise((resolve, reject) => {
                    const authenticationDetails = new AuthenticationDetails({
                        Username: email,  // "rioc.sugiyama@gmail.com"
                        Password: password // "Wasd1234",
                    });
                    const cognitoUser = new CognitoUser({
                        Username: email,
                        Pool    : this.state.cognitoUserPool
                    });
                    this.setState({ cognitoUser });
                    cognitoUser.authenticateUser(
                        authenticationDetails,
                        {
                            onSuccess: result => {
                                const jwtToken = result.getAccessToken().getJwtToken();
                                resolve(jwtToken);
                                this.setState({ jwtToken });
                                console.log("access token + " + result.getAccessToken().getJwtToken());
                            },
                            onFailure: err => reject(err)
                        }
                    );
                }),
                signUp: (email: string, password: string) => {
                    this.state.cognitoUserPool.signUp(email, password, [], [], (err: any, result: any) => {
                        if (err) {
                            alert(err.message || JSON.stringify(err));
                            return;
                        }
                        const cognitoUser = result.user;
                        console.log("user name is " + cognitoUser.getUsername());
                    });
                },
                signOut: () => new Promise((resolve, reject) => {
                    const cognitoUser = this.state.cognitoUser;
                    if (cognitoUser !== null) {
                        (cognitoUser as CognitoUser).globalSignOut({
                            onSuccess: () => {
                                this.setState({ jwtToken: null, cognitoUser: null });
                                console.log("resolve");
                                resolve();
                            },
                            onFailure: () => reject()
                        });
                    }
                }),
                jwtToken: this.state.jwtToken,
                cognitoUserPool: this.state.cognitoUserPool
            },
            ...this.props
        });
    }
}
