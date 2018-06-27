import gql from "graphql-tag";

export default gql(`
    mutation updateWork(
        $work: WorkUpdate!
    ) {
        createWork(
            work: $work
        ) {
            id
            description
            userId
            title
            tags
            imageUri
            createdAt
        }
    }
`);
