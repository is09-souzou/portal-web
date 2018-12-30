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
    type: "anchor" | "bold" | "heading" | "italic" | "list" | "listNumber" | "strikethrough" | "separator",
    onChangeValue: MarkdownSupportsProps["onChangeValue"],
    element?: HTMLInputElement | HTMLTextAreaElement
) => () => {
    if (!element) return;

    const selectionNumbers = getSelectionNumbers(element);

    const convertFunc: (value: string, selectionNumbers: [number, number]) => [string, [number, number]] = (
        type === "anchor"        ? convertToAnchor
      : type === "bold"          ? convertToBold
      : type === "heading"       ? convertToHeading
      : type === "italic"        ? convertToItalic
      : type === "list"          ? convertToList
      : type === "listNumber"    ? convertToListNumber
      : type === "strikethrough" ? convertToStrikethrough
      : type === "separator"     ? insertSeparator
      :                            insertSeparator
    );

    const [value, newSelectionNumbers] = convertFunc(element.value, selectionNumbers);

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
            // tslint:disable-next-line:jsx-no-lambda
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
            <span>・</span>
        </ToolItem>
        <ToolItem
            onClick={handleConvert("separator", onChangeValue, element)}
        >
            <span>─</span>
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
