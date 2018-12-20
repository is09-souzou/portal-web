export default (element: HTMLInputElement | HTMLTextAreaElement, lines: number[]): [string, number] => {
    let adjustmentCount = 0;
    const value = element.value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 >= lines[0] && i + 1 <= lines[1]) {
                if (/^[-]{3}/.test(x)) {
                    adjustmentCount = adjustmentCount - 3;
                    return x.replace(/^[-]{3}/g, "");
                }
                return x.replace(/^/g, "\n---\n\n");
            }
            adjustmentCount = adjustmentCount + 3;
            return x;
        })
        .join("\n");
    return ([value, adjustmentCount]);
};
