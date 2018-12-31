import config     from "src/config";
import toURIQuery from "src/api/toURIQuery";

interface Props {
    userId  : string;
    type    : string;
    mimetype: string;
    jwt     : string;
}

type ResponseJson = {
    signedUrl: string;
    uploadedUrl: string;
};

export default async (
    {
        userId,
        type,
        mimetype,
        jwt,
    }: Props
): Promise<ResponseJson> => {
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

    return (await response.json()) as ResponseJson;
};
