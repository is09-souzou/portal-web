import gql from "graphql-tag";

export default gql(`
    query($id: String!) {
        getUser(id: $id) {
            id
            email
            name
            career
            avatarUri
            message
        }
    }`
);
