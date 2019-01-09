import { Tab, Tabs } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

type Content = { value: string, text: string };

export default (
    {
        contents,
        selectedContentValue,
        onSelectContent
    }: {
        contents: Content[],
        selectedContentValue: string,
        onSelectContent: (content: Content) => void
    }
) => (
    <Host>
        <Tabs
            value={selectedContentValue}
            indicatorColor="primary"
            textColor="primary"
        >
            {contents.map(x =>
                <Tab
                    disableRipple
                    key={x.value}
                    label={x.text}
                    value={x.value}
                    onClick={() => onSelectContent(x)}
                />
            )}
        </Tabs>
    </Host>
);

const Host = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    visibility: hidden;
    @media (max-width: 768px) {
        visibility: visible;
    }
`;
