import * as H from "history";
import toObjectFromURIQuery from "src/api/toObjectFromURIQuery";
import deduplicationFromArray from "src/util/deduplicationFromArray";

export default (param: string, history: H.History): string[] => {
    const queryParam = toObjectFromURIQuery(history.location.search);
    const tags = deduplicationFromArray(
        !queryParam        ? []
      : queryParam[param]  ? queryParam[param].split(",")
      :                      []
    );
    return queryParam && !((tags.length === 1 && tags[0] === "") || tags.length === 0) ? queryParam[param].split(",").map(x => (decodeURIComponent(x)))
                       :                                                                 [];
};
