import deduplicationFromArray from "./deduplicationFromArray";

export default (tags: string[], currentTags?: string[]) =>
    // tslint:disable-next-line:prefer-template
    "?tags=" + (
        currentTags ? (
            deduplicationFromArray(currentTags.concat(tags))
                .reduce((prev, next, i) => i === 0 ? next : `${prev},${next}`, "")
        )
      :               tags.reduce((prev, next, i) => i === 0 ? next : `${prev},${next}`, "")
    );
