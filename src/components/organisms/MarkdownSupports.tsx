import {
    CodeRounded               as CodeIcon,
    FormatBoldRounded         as BoldIcon,
    FormatItalicRounded       as ItalicIcon,
    FormatListBulletedRounded as ListBulletedIcon,
    FormatListNumberedRounded as ListIcon,
    FormatQuoteRounded        as QuoteIcon,
    LinkRounded               as LinkIcon,
    StrikethroughSRounded     as StrikeIcon,
    TableChartRounded         as TableChartIcon
} from "@material-ui/icons";
import React from "react";
import ToolItem from "src/components/atoms/ToolItem";
import ToolList from "src/components/atoms/ToolList";
import {
    convertToAnchor,
    convertToBold,
    convertToHeading,
    convertToItalic,
    convertToList,
    convertToListNumber,
    convertToQuote,
    convertToStrikethrough,
    getSelectionNumbers,
    insertSeparator,
    insertSnippet,
    insertTable
} from "src/util/markdown";

export type MarkdownSupportsProps = {
    element: HTMLTextAreaElement | React.RefObject<HTMLTextAreaElement>;
    onChangeValue: (value: string, selections: [number, number]) => void
};

const handleConvert = (
    type: "anchor" | "bold" | "heading" | "italic" | "list" | "listNumber" | "quote" | "snippet" | "strikethrough" | "separator" | "table" ,
    onChangeValue: MarkdownSupportsProps["onChangeValue"],
    element: HTMLTextAreaElement | React.RefObject<HTMLTextAreaElement>
) => () => {
    let _element: HTMLTextAreaElement | null;
    if (element instanceof HTMLTextAreaElement) {
        _element = element;
    } else {
        _element = (element as React.RefObject<HTMLTextAreaElement>).current;
    }

    if (!_element) return;

    const selectionNumbers = getSelectionNumbers(_element);

    const convertFunc: (value: string, selectionNumbers: [number, number]) => [string, [number, number]] = (
        type === "anchor"        ? convertToAnchor
      : type === "bold"          ? convertToBold
      : type === "heading"       ? convertToHeading
      : type === "italic"        ? convertToItalic
      : type === "list"          ? convertToList
      : type === "listNumber"    ? convertToListNumber
      : type === "quote"         ? convertToQuote
      : type === "strikethrough" ? convertToStrikethrough
      : type === "separator"     ? insertSeparator
      : type === "snippet"       ? insertSnippet
      : type === "table"         ? insertTable
      :                            insertTable
    );

    const [value, newSelectionNumbers] = convertFunc(_element.value, selectionNumbers);

    onChangeValue(
        value,
        newSelectionNumbers
    );
};

// TODO: https://mimemo.io/m/mqLXOlJe7ozQ19r
export default (
    {
        element,
        onChangeValue
    }: MarkdownSupportsProps
) => (
    <ToolList>
        <ToolItem
            onClick={handleConvert("heading", onChangeValue, element)}
        >
            <span>H</span>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("listNumber", onChangeValue, element)}
        >
            <ListIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("list", onChangeValue, element)}
        >
            <ListBulletedIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("separator", onChangeValue, element)}
        >
            <span>─</span>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("anchor", onChangeValue, element)}
        >
            <LinkIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("quote", onChangeValue, element)}
        >
            <QuoteIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("snippet", onChangeValue, element)}
        >
            <CodeIcon/>
        </ToolItem><ToolItem
            onClick={handleConvert("table", onChangeValue, element)}
        >
            <TableChartIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("strikethrough", onChangeValue, element)}
        >
            <StrikeIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("bold", onChangeValue, element)}
        >
            <BoldIcon/>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("italic", onChangeValue, element)}
        >
            <ItalicIcon/>
        </ToolItem>
    </ToolList>
);