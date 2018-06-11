import gql from "graphql-tag";

export default gql(`
    query($limit: Int, $nextToken: String) {
        listUsers(limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
            }
        }
    }`
);
