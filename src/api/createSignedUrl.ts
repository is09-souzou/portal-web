import config     from "../config";
import toURIQuery from "./toURIQuery";

interface Props {
    userId  : string;
    type    : string;
    mimetype: string;
    jwt     : string;
}

export default async (
    {
        userId,
        type,
        mimetype,
        jwt,
    }: Props
): Promise<string> => {
    const response = await fetch(
        `${config.apiGateway.uri}/signed-url?${toURIQuery({ userId, type, mimetype })}`,
        {
            method : "GET",
            headers: {
                Authorization: jwt,
                Date: new Date().toUTCString()
            }
        }
    );

    if (!response.ok)
        throw response;

    return (await response.json());
};
