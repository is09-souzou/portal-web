import gql from "graphql-tag";

export default gql(`
    query {
        listUsers {
            items {
                id
                name
            }
        }
    }`
);
