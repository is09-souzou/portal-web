import convertToQueryString from "src/api/convertToQueryString";

export default async (url: string, words: string[]) => {

    const response = await fetch(
        `${url}/search${convertToQueryString("q", words)}`,
        { method : "GET" }
    );

    if (!response.ok)
        throw response;

    return await response.json();
};
