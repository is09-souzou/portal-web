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
            variant="fullWidth"
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
    display: none;
    box-shadow: 0px -1px 5px 0px rgba(0,0,0,.3);
    @media (max-width: 768px) {
        display: flex;
    }
`;
