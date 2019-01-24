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
import FlexibleSpace from "src/components/atoms/FlexibleSpace";
import LocationText from "src/components/atoms/LocationText";
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
import styled from "styled-components";

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
    <Host>
        <div>
            <Tooltip title={<LocationText text="Bold"/>}>
                <ToolItem
                    onClick={handleConvert("bold", onChangeValue, element)}
                >
                    <BoldIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Italic"/>}>
                <ToolItem
                    onClick={handleConvert("italic", onChangeValue, element)}
                >
                    <ItalicIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Strikethrough"/>}>
                <ToolItem
                    onClick={handleConvert("strikethrough", onChangeValue, element)}
                >
                    <StrikeIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Heading"/>}>
                <ToolItem
                    onClick={handleConvert("heading", onChangeValue, element)}
                >
                    <span>H</span>
                </ToolItem>
            </Tooltip>
        </div>
        <FlexibleSpace/>
        <div>
            <Tooltip title={<LocationText text="Code"/>}>
                <ToolItem
                    onClick={handleConvert("snippet", onChangeValue, element)}
                >
                    <CodeIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Quote"/>}>
                <ToolItem
                    onClick={handleConvert("quote", onChangeValue, element)}
                >
                    <QuoteIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Generic list"/>}>
                <ToolItem
                    onClick={handleConvert("list", onChangeValue, element)}
                >
                    <ListBulletedIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Numbered list"/>}>
                <ToolItem
                    onClick={handleConvert("listNumber", onChangeValue, element)}
                >
                    <ListIcon/>
                </ToolItem>
            </Tooltip>
        </div>
        <FlexibleSpace/>
        <div>
            <Tooltip title={<LocationText text="Create link"/>}>
                <ToolItem
                    onClick={handleConvert("anchor", onChangeValue, element)}
                >
                    <LinkIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Insert table"/>}>
                <ToolItem
                    onClick={handleConvert("table", onChangeValue, element)}
                >
                    <TableChartIcon/>
                </ToolItem>
            </Tooltip>
            <Tooltip title={<LocationText text="Insert horizontal line"/>}>
                <ToolItem
                    onClick={handleConvert("separator", onChangeValue, element)}
                >
                    <span>─</span>
                </ToolItem>
            </Tooltip>
        </div>
    </Host>
);

const Host = styled(ToolList)`
    @media (max-width: 768px) {
        display: flex;
        flex-wrap: wrap;
    }
`;
