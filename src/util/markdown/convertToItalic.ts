export default (element: HTMLInputElement | HTMLTextAreaElement, lines: number[]): [string, number] => {
    let adjustmentCount = 0;
    const value = element.value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 >= lines[0] && i + 1 <= lines[1]) {
                adjustmentCount = adjustmentCount + 2;
                return x.replace(/^.*$/g, "_$&_");
            }
            return x;
        })
        .join("\n");
    return ([value, adjustmentCount]);
};
