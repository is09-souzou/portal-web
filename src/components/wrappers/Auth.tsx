import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import React, { useState } from "react";
import config from "src/config";
import AuthContext, { Subscriber as AuthSubscriber, Token } from "src/contexts/AuthContext";

const cognitoUserPool = new CognitoUserPool(config.cognito);

type Subscriber = {
    id: string;
    fn: AuthSubscriber;
};

export default (
    {
        children
    }: React.Props<{}>
) => {

    const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(cognitoUserPool.getCurrentUser());
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [token, _setToken] = useState<Token | null>(
        () => cognitoUser && cognitoUser.getSession((err: any, session: any) => {
            if (err) {
                throw err;
            }
            return session.accessToken;
        })
    );
    const updateToken = (token: Token | null) => {
        _setToken(token);
        for (const x of subscribers)
            x.fn(token);
    };

    return (
        <AuthContext.Provider
            value={{
                cognitoUser,
                cognitoUserPool,
                token,
                idToken: (() => {
                    const userSession = cognitoUser && cognitoUser.getSignInUserSession();
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
                        Pool    : cognitoUserPool,
                        Username: email,
                    });
                    setCognitoUser(cognitoUser);
                    cognitoUser.authenticateUser(
                        authenticationDetails,
                        {
                            onFailure: err => reject(err),
                            onSuccess: result => {
                                const accessToken = result.getAccessToken();
                                const jwtToken = accessToken.getJwtToken();
                                const token = { jwtToken, payload: accessToken.decodePayload() };
                                resolve(token);
                                updateToken(token);
                            }
                        }
                    );
                }),
                signOut: () => new Promise((resolve, reject) => {
                    if (cognitoUser !== null) {
                        (cognitoUser as CognitoUser).globalSignOut({
                            onFailure: err => {
                                updateToken(null);
                                setCognitoUser(null);
                                localStorage.clear();
                                location.reload();
                                reject(err);
                            },
                            onSuccess: () => {
                                updateToken(null);
                                setCognitoUser(null);
                                resolve();
                            }
                        });
                    }
                }),
                signUp: (userName, password, attribute) => new Promise((resolve, reject) => {
                    cognitoUserPool.signUp(
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
                updateEmail: (email) => new Promise((resolve, reject) => {
                    cognitoUser!.updateAttributes(
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
                    cognitoUser!.changePassword(
                        password,
                        newPassword,
                        (err, result) => (err || !result) ? reject(err) : resolve()
                    )
                ),
                subscribeToken: (subscriber) => {
                    const id = Math.random().toString();
                    setSubscribers(
                        subscribers.concat({
                            id,
                            fn: subscriber
                        })
                    );
                    return () => setSubscribers(
                        subscribers.filter(x => x.id !== id)
                    );
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
