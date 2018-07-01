import gql from "graphql-tag";

export default gql(`
    query　{
        gethWorkByTag(tags:"tag") {
            items{
                id
                tags
                userId
                title
            },
            nextToken
        }
    }
`);
