import gql from "graphql-tag";

export default gql(`
    mutation createUser($user: User!) {
        createUser(
            user: {
                id: "8a1f706a-1182-4912-8eb1-2e154f174b30"
                name: "III"
                email: "SDAF"
            }
        ) {
            id
            email
            name
            avatorURI
            career
            messeage
        }
    }`
);

// mutation addTodo($type: String!) {
//     addTodo(type: $type) {
//       id
//       type
//     }
//   }
