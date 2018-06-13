import config     from "../config";
import toURIQuery from "./toURIQuery";

interface Props {
    filename: string;
    mimetype: string;
    jwt     : string;
}

export default async (
    {
        filename,
        mimetype,
        jwt,
    }: Props
): Promise<string> => {
    const response = await fetch(
        `${config.apiGateway.uri}/signed-url?${toURIQuery({ filename, mimetype })}`,
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

    return (await response.json()).signedUrl;
};
