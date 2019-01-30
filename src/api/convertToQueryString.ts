import deduplicationFromArray from "src/util/deduplicationFromArray";

export default (param: string, list: string[], prevList?: string[]) =>
    // tslint:disable-next-line:prefer-template
    `?${param}=` + (
        prevList ? (
            deduplicationFromArray(prevList.concat(list))
                .reduce((prev, next, i) => i === 0 ? next : `${prev},${next}`, "")
        )
      :               deduplicationFromArray(list).reduce((prev, next, i) => i === 0 ? next : `${prev},${next}`, "")
    );
