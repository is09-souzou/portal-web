import gql from "graphql-tag";

export default gql(`
    mutation createWork(
        $work: WorkCreate!
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
