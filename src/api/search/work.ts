// WIP
// import config from "src/config";

// export default async ({
//     image,
//     user,
//     organization,
//     token,
// }) => {

//     const response = await fetch(
//         url + "/v1/organizations/" + organization.id + "/users/" + user.id + "/image",
//         {
//             method : "POST",
//             body   : toFormData({"image_file": image}),
//             headers: {
//                 "Authorization": "Bearer " + jwt,
//             }
//         }
//     )

//     if (!response.ok)
//         throw response

//     let responseJson = await response.json()

//     await firebase
//         .database(token.app)
//         .ref("organizations/" + organization.id + "/users/" + user.id)
//         .update({
//             image: responseJson["file_path"]
//         })

//     return true
// }
