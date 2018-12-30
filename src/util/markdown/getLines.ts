import getLineNumber from "./getLineNumber";

export default (value: string, selectionNumbers: number[]) => {
    return [
        getLineNumber(value, selectionNumbers[0]),
        getLineNumber(value, selectionNumbers[1])
    ];
};
