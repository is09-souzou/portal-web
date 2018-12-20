import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";

export default {
    appSync : {
        graphqlEndpoint: "https://2y3z3mqk3vacvkudw22wqicade.appsync-api.ap-northeast-1.amazonaws.com/graphql",
        region: "ap-northeast-1",
        authenticationType: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    },
    publicAppSync : {
        graphqlEndpoint: "https://l7ebet6hcndmjpgmbkthbiyvem.appsync-api.ap-northeast-1.amazonaws.com/graphql",
        region: "ap-northeast-1",
        authenticationType: AUTH_TYPE.API_KEY,
        apiKey: "da2-ropcunocwzddldbksqr54lenwy",
    },
    apiGateway: {
        uri: "https://qh0uqafx50.execute-api.ap-northeast-1.amazonaws.com/dev"
    },
    cognito: {
        region: "ap-northeast-1",
        UserPoolId: "ap-northeast-1_qGTsh79dE",
        ClientId: "4h2qektp3ghm3qg90sth1q9ksu",
    }
};
