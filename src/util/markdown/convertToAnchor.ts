import baseTextConverter from "./baseTextConverter";

export default (value: string, selectionNumbers: [number, number]): [string, [number, number]] =>
    baseTextConverter({
        value,
        selectionNumbers,
        syntax: "[",
        syntaxEnd: "](https://)",
        syntaxRegex: "\\[",
        syntaxRegexEnd: "\\]\\(https:\\/\\/\\)"
    });
