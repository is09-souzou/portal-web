import * as H from "history";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";

export default (history: H.History) => {
    const queryParam = toObjectFromURIQuery(history.location.search);
    const tags = !queryParam        ? []
               : queryParam["tags"] ? queryParam["tags"].split(",")
               :                      [];
    return queryParam && !((tags.length === 1 && tags[0] === "") || tags.length === 0) ? queryParam["tags"].split(",")
                       :                                                                 [];
};
