import getLineNumber from "./getLineNumber";

export default (element: HTMLInputElement | HTMLTextAreaElement, selectionNumbers: number[]) => {
    return [
        getLineNumber(element.value, selectionNumbers[0]),
        getLineNumber(element.value, selectionNumbers[1])
    ];
};
