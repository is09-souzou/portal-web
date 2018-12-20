export default (element: HTMLInputElement | HTMLTextAreaElement) => ([
    element.selectionStart || 0 ,
    element.selectionEnd || 0
]);
