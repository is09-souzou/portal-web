import gql from "graphql-tag";

export default gql(`
    mutation createWork(
        $work: work
    ) {
        createWork(
            work: $work
        ) {
            id
            userId
            title
            tags
            imageUri
            createdAt
        }
    }
`);
