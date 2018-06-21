import gql from "graphql-tag";

export default gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
            career
            avatarUri
            message
        }
    }`
);
