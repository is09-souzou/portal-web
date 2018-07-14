import * as H               from "history";
import toObjectFromURIQuery from "../api/toObjectFromURIQuery";

export default (history: H.History) => {
    const queryParam = toObjectFromURIQuery(history.location.search);
    const tags = queryParam ? queryParam["tags"].split(",") : [];
    return queryParam && !(tags.length === 1 && tags[0] === "") ? queryParam["tags"].split(",") : [];
};
