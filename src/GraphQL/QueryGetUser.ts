import gql from "graphql-tag";

export default gql(`
    query($id: ID!) {
        getUser {
            id
            email
            name
            career
            avatorURI
            messeage
        }
    }`
);
