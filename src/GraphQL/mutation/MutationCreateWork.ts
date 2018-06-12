import gql from "graphql-tag";

export default gql(`
    mutation (
        $WorkInput: work
    ) {
        createWork(
            work: $WorkInput
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
