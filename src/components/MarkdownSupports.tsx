import React from "react";
import {
    FormatBoldRounded         as BoldIcon,
    FormatListNumberedRounded as ListIcon,
    FormatItalicRounded       as ItalicIcon,
    LinkRounded               as LinkIcon,
    StrikethroughSRounded     as StrikeIcon
} from "@material-ui/icons";
import {
    convertToAnchor,
    convertToBold,
    convertToHeading,
    convertToItalic,
    convertToList,
    convertToListNumber,
    convertToStrikethrough,
    getLines,
    getSelectionNumbers,
    insertSeparator
} from "./../util/markdown";
import ToolItem from "./ToolItem";
import ToolList from "./ToolList";

export type MarkdownSupportsProps = {
    element?: HTMLInputElement | HTMLTextAreaElement;
    onChangeValue: (value: string, selections: [number, number]) => void
};

const handleConvert = (
    type: "anchor" | "bold" | "heading" | "italic" | "list" | "listNumber" | "separator" | "strikethrough",
    onChangeValue: MarkdownSupportsProps["onChangeValue"],
    element?: HTMLInputElement | HTMLTextAreaElement
) => () => {
    if (!element) return;

    const selectionNumbers = getSelectionNumbers(element);
    const lines = getLines(element, selectionNumbers);

    const convertFunc: (element: HTMLInputElement | HTMLTextAreaElement, lines: number[]) => [string, number] = (
        type === "anchor"        ? convertToAnchor
      : type === "bold"          ? convertToBold
      : type === "heading"       ? convertToHeading
      : type === "italic"        ? convertToItalic
      : type === "list"          ? convertToList
      : type === "listNumber"    ? convertToListNumber
      : type === "separator"     ? insertSeparator
      : type === "strikethrough" ? convertToStrikethrough
      :                            convertToStrikethrough
    );

    const [value, adjustmentCount] = convertFunc(element, lines);

    onChangeValue(
        value,
        [selectionNumbers[0], selectionNumbers[1] + adjustmentCount]
    );
};

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
            <ListIcon />
        </ToolItem>
        <ToolItem
            onClick={handleConvert("list", onChangeValue, element)}
        >
            ・
        </ToolItem>
        <ToolItem
            onClick={handleConvert("separator", onChangeValue, element)}
        >
            ─
        </ToolItem>
        <ToolItem
            onClick={handleConvert("anchor", onChangeValue, element)}
        >
            <LinkIcon />
        </ToolItem>
        <ToolItem
            onClick={handleConvert("strikethrough", onChangeValue, element)}
        >
            <StrikeIcon />
        </ToolItem>
        <ToolItem
            onClick={handleConvert("bold", onChangeValue, element)}
        >
            <BoldIcon />
        </ToolItem>
        <ToolItem
            onClick={handleConvert("italic", onChangeValue, element)}
        >
            <ItalicIcon />
        </ToolItem>
    </ToolList>
);
