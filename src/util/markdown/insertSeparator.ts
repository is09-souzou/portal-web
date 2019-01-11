import getLines from "src/util/markdown/getLines";

export default (value: string, selectionNumbers: [number, number]): [string, [number, number]] => {
    const lines = getLines(value, selectionNumbers);

    let adjustmentCount = 0;
    const convertedValue = value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 - 1 === lines[1]) {
                adjustmentCount = adjustmentCount + 3;
                return x.replace(/^/g, "---\n");
            }
            return x;
        })
        .join("\n");

    return [
        convertedValue,
        [
            selectionNumbers[0] + adjustmentCount,
            selectionNumbers[1] + adjustmentCount
        ]
    ];
};
