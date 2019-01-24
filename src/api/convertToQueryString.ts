import deduplicationFromArray from "src/util/deduplicationFromArray";

export default (param: string, tags: string[], currentTags?: string[]) =>
    // tslint:disable-next-line:prefer-template
    `?${param}=` + (
        currentTags ? (
            deduplicationFromArray(currentTags.concat(tags))
                .reduce((prev, next, i) => i === 0 ? next : `${prev},${next}`, "")
        )
      :               tags.reduce((prev, next, i) => i === 0 ? next : `${prev},${next}`, "")
    );
