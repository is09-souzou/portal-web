import { Tooltip } from "@material-ui/core";
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
        <Tooltip title="Heding">
            <ToolItem
                onClick={handleConvert("heading", onChangeValue, element)}
            >
                <span>H</span>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Numbered List">
            <ToolItem
                onClick={handleConvert("listNumber", onChangeValue, element)}
            >
                <ListIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Generic List">
            <ToolItem
                onClick={handleConvert("list", onChangeValue, element)}
            >
                <ListBulletedIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Insert Horizontal Line">
            <ToolItem
                onClick={handleConvert("separator", onChangeValue, element)}
            >
                <span>─</span>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Create Link">
            <ToolItem
                onClick={handleConvert("anchor", onChangeValue, element)}
            >
                <LinkIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Quote">
            <ToolItem
                onClick={handleConvert("quote", onChangeValue, element)}
            >
                <QuoteIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Code">
            <ToolItem
                onClick={handleConvert("snippet", onChangeValue, element)}
            >
                <CodeIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Insert Table">
            <ToolItem
                onClick={handleConvert("table", onChangeValue, element)}
            >
                <TableChartIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Strikethrough">
            <ToolItem
                onClick={handleConvert("strikethrough", onChangeValue, element)}
            >
                <StrikeIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Bold">
            <ToolItem
                onClick={handleConvert("bold", onChangeValue, element)}
            >
                <BoldIcon/>
            </ToolItem>
        </Tooltip>
        <Tooltip title="Italic">
            <ToolItem
                onClick={handleConvert("italic", onChangeValue, element)}
            >
                <ItalicIcon/>
            </ToolItem>
        </Tooltip>
    </ToolList>
);
