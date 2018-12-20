export default (element: HTMLInputElement | HTMLTextAreaElement, lines: number[]): [string, number] => {
    let count = 0;
    let adjustmentCount = 0;
    const value = element.value.split("\n")
        .map((x: string, i: number) => {
            if (i + 1 >= lines[0] && i + 1 <= lines[1]) {
                const match = (x.match(/^[0-9]*\. /g) || [])[0];
                if (match) {
                    adjustmentCount = adjustmentCount - match.length;
                    return x.replace(/^[0-9]*\. /g, "");
                }
                count = count + 1;
                adjustmentCount = adjustmentCount + `${count}`.length + 2;
                return x.replace(/^/g, `${count}\. `);
            }
            return x;
        })
        .join("\n");

    return ([value, adjustmentCount]);
};
