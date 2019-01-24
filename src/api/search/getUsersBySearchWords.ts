import esApi from "src/api/search/esApi";
import config from "src/config";
import { User, UserConnection } from "src/graphQL/type";

export default async (words: string[]): Promise<UserConnection> => {
    const x = await esApi(config.elasticsearch.users.endPoint, words);
    const result: User[] = x.hits.hits.map((item: any) =>
        Object
            .entries(item._source)
            .map(([key, value]) => ({
                [key]: Object.entries(value).map(([_k, v]) => v)[0]
            }))
            .reduce((x, y) => ({ ...x, ...y }), {})
    );
    return ({
        items: result,
        exclusiveStartKey: ""
    });
};
