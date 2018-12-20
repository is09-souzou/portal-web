// TODO: Insert selected URL in return value
export default (element: HTMLInputElement | HTMLTextAreaElement, lines: number[]): [string, number] => {
    let adjustmentCount = 0;
    const value = element.value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 >= lines[0] && i + 1 <= lines[1]) {
                adjustmentCount = adjustmentCount + 12;
                return x.replace(/^/g, "[](https://)");
            }
            return x;
        })
        .join("\n");
    return ([value, adjustmentCount]);
};
