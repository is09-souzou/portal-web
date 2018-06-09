import React, { ReactNode } from "react";
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import config from "./../../config";

export interface AuthProps {
    auth: {
        signIn: (email: string, password: string) => Promise<string>;
        signUp: (email: string, password: string) => Promise<any>;
        signOut: () => Promise<void>;
        jwtToken: string | null;
        cognitoUserPool: CognitoUserPool | null;
    };
}

interface PropsModel {
    render: (auth: AuthProps) => ReactNode;
}

interface StateModel {
    cognitoUserPool: CognitoUserPool;
    jwtToken: string | null;
    cognitoUser: CognitoUser | null;
}

export default class extends React.Component<PropsModel, StateModel> {

    componentWillMount() {

        const cognitoUserPool = new CognitoUserPool(config.cognito);

        const cognitoUser = cognitoUserPool.getCurrentUser();

        this.setState({
            cognitoUser,
            cognitoUserPool,
            jwtToken: null,
        });

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

        const {
            render
        } = this.props;

        return render({
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
                signUp: (email: string, password: string) => new Promise((resolve, reject) => {
                    this.state.cognitoUserPool.signUp(email, password, [], [], (err: any, result: any) => {
                        if (err) {
                            reject(err);
                            alert(err.message || JSON.stringify(err));
                            return;
                        }
                        const cognitoUser = result.user;
                        console.log("user name is " + cognitoUser.getUsername());
                        resolve(result);
                    });
                }),
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
            }
        });
    }
}
