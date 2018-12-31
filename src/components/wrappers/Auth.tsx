import {
    AuthenticationDetails,
    CognitoIdToken,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import React, { ReactNode } from "react";
import config from "src/config";

export interface Token {
    jwtToken: string;
    payload: {
        [id: string]: any;
    };
}

export type SingIn = (email: string, password: string) => Promise<Token>;
export type SingUp = (userName: string, password: string, attribute?: {[key: string]: string}) => Promise<string>;
export type SingOut = () => Promise<void>;
export type UpdateEmail = (email: string) => Promise<void>;
export type UpdatePassword = (password: string, newPassword: string) => Promise<void>;

export type AuthProps = {
    auth: {
        signIn: SingIn;
        signUp: SingUp;
        signOut: SingOut;
        updateEmail: UpdateEmail;
        updatePassword: UpdatePassword;
        token: Token | null;
        idToken?: CognitoIdToken;
        cognitoUser?: CognitoUser | null;
        cognitoUserPool?: CognitoUserPool | null;
    };
};

interface Props {
    render: (auth: AuthProps) => ReactNode;
}

interface State {
    cognitoUserPool: CognitoUserPool;
    token: Token | null;
    cognitoUser: CognitoUser | null;
}

export default class extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const cognitoUserPool = new CognitoUserPool(config.cognito);

        const cognitoUser = cognitoUserPool.getCurrentUser();

        this.state = {
            cognitoUser,
            cognitoUserPool,
            token: null
        };

        if (cognitoUser != null) {
            cognitoUser.getSession((err: any, session: any) => {
                if (err) {
                    throw err;
                }
                this.state = {
                    cognitoUser,
                    cognitoUserPool,
                    token: session.accessToken
                };
            });
        }
    }

    render() {

        const {
            render
        } = this.props;

        return render({
            auth: {
                cognitoUser: this.state.cognitoUser,
                cognitoUserPool: this.state.cognitoUserPool,
                idToken: (() => {
                    const userSession = this.state.cognitoUser && this.state.cognitoUser.getSignInUserSession();
                    if (!userSession)
                        return undefined;
                    return userSession.getIdToken();
                })(),
                signIn: (email: string, password: string) => new Promise((resolve, reject) => {
                    const authenticationDetails = new AuthenticationDetails({
                        Password: password,
                        Username: email
                    });
                    const cognitoUser = new CognitoUser({
                        Pool    : this.state.cognitoUserPool,
                        Username: email,
                    });
                    this.setState({ cognitoUser });
                    cognitoUser.authenticateUser(
                        authenticationDetails,
                        {
                            onFailure: err => reject(err),
                            onSuccess: result => {
                                const accessToken = result.getAccessToken();
                                const jwtToken = accessToken.getJwtToken();
                                const token = { jwtToken, payload: accessToken.decodePayload() };
                                resolve(token);
                                this.setState({ token });
                            }
                        }
                    );
                }),
                signOut: () => new Promise((resolve, reject) => {
                    const cognitoUser = this.state.cognitoUser;
                    if (cognitoUser !== null) {
                        (cognitoUser as CognitoUser).globalSignOut({
                            onFailure: err => {
                                this.setState({ token: null, cognitoUser: null });
                                localStorage.clear();
                                location.reload();
                                reject(err);
                            },
                            onSuccess: () => {
                                this.setState({ token: null, cognitoUser: null });
                                resolve();
                            }
                        });
                    }
                }),
                signUp: (userName, password, attribute) => new Promise((resolve, reject) => {
                    this.state.cognitoUserPool.signUp(
                        userName,
                        password,
                        Object.entries(attribute || []).map(([Name, Value]) =>
                            new CognitoUserAttribute({ Name, Value })
                        ),
                        [],
                        (err?, result?) => {
                            if (err || !result) {
                                reject(err);
                                return;
                            }
                            resolve(result.userSub);
                        }
                    );
                }),
                token: this.state.token,
                updateEmail: (email) => new Promise((resolve, reject) => {
                    this.state.cognitoUser!.updateAttributes(
                        [{
                            Name: "email",
                            Value: email
                        }],
                        err => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve();
                        }
                    );
                }),
                updatePassword: (password, newPassword) => new Promise((resolve, reject) =>
                    this.state.cognitoUser!.changePassword(
                        password,
                        newPassword,
                        (err, result) => (err || !result) ? reject(err) : resolve()
                    )
                ),
            }
        });
    }
}
