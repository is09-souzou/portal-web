import gql from "graphql-tag";

export default gql(`
    mutation createUser(
        $id: ID!
        $email: String!
        $displayName: String!
        $avatorURI: String
        $career: String
        $messeage: String
    ) {
        createUser(
            id: $id
            email: $email
            displayName: $displayName
            avatorURI: $avatarURI
            career: $career
            messeage: $message
        ) {
            id
            email
            displayName
            avatorURI
            career
            messeage
        }
    }`
);
