import getLines from "./getLines";

export default (value: string, selectionNumbers: [number, number]): [string, [number, number]] => {
    const lines = getLines(value, selectionNumbers);

    let adjustmentCount = 0;
    const convertedValue = value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 >= lines[0] && i + 1 <= lines[1]) {
                if (/^[-]{3}/.test(x)) {
                    adjustmentCount = adjustmentCount - 3;
                    return x.replace(/^[-]{3}/g, "");
                }
                return x.replace(/^/g, "\n---\n");
            }
            adjustmentCount = adjustmentCount + 3;
            return x;
        })
        .join("\n");

    return [
        convertedValue,
        [
            selectionNumbers[0],
            selectionNumbers[1] + adjustmentCount
        ]
    ];
};
