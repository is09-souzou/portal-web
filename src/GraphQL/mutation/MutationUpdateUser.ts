import gql from "graphql-tag";

export default gql(`
    mutation updateUser(
        $user: UserUpdate!
    ) {
        updateUser(
            user: $user
        ) {
            id
            email
            displayName
            career
            avatarUri
            message
        }
    }
`);
