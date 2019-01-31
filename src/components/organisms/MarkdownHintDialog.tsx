import {
    Tab,
    Tabs
} from "@material-ui/core";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import Slide, { SlideProps } from "@material-ui/core/Slide";
import React, {  useState } from "react";
import LocationText from "src/components/atoms/LocationText";
import PortalMarkdown from "src/components/atoms/PortalMarkdown";
import ViewPager from "src/components/atoms/ViewPager";
import styled from "styled-components";

export default (
    {
        open,
        onClose,
        ...props
    }: DialogProps
) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            keepMounted
            {...props}
        >
            <Tabs
                value={activeIndex}
                onChange={(_event, value) => setActiveIndex(value)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab
                    label={<LocationText text="Font style"/>}
                    value={0}
                />
                <Tab
                    label={<LocationText text="List"/>}
                    value={1}
                />
                <Tab
                    label={<LocationText text="Decoration"/>}
                    value={2}
                />
            </Tabs>
            <ViewPager
                selectedIndex={activeIndex}
            >
                <DialogContent>
                    <PortalMarkdown
                        // tslint:disable-next-line:prefer-template
                        source={"```\n" + fontStyleSample + "```"}
                    />
                    <PortalMarkdown
                        source={fontStyleSample}
                    />
                </DialogContent>
                <DialogContent>
                    <PortalMarkdown
                        // tslint:disable-next-line:prefer-template
                        source={"```\n" + listSample + "```"}
                    />
                    <PortalMarkdown
                        source={listSample}
                    />
                </DialogContent>
                <DialogContent>
                    <PortalMarkdown
                        // tslint:disable-next-line:prefer-template
                        source={"```\n" + decorationSample + "```"}
                    />
                    <PortalMarkdown
                        source={decorationSample}
                    />
                </DialogContent>
            </ViewPager>
        </Dialog>
    );
};

const Transition = (props:SlideProps) =>  <Slide direction="up" {...props}/>;

const DialogContent = styled.div`
    && {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 1rem;
        > :first-child {
            margin-right: 1rem;
        }
        > * {
            flex-grow: 1;
        }
        @media (max-width: 768px) {
            > :first-child {
                margin-right: initial;
                margin-bottom: 1rem;
            }
        }
    }
`;

const fontStyleSample = `
**Bold**

---

*Italic*

---

~~Strikethrough~~

---

# Heading1
## Heading2
### Heading3
#### Heading4
##### Heading5
###### Heading6
`;

const listSample = `
* Generic list1
* Generic list2
* Generic list3

---

1. Numbered list1
2. Numbered list2
3. Numbered list3
`;

const decorationSample = `
> Quote

---

[Link](https://www.souzou-portal.com/)

---

| Left | Center | Right |
| ---- | :----: | ----: |
| a    | b      | c     |
| d    | e      | f     |
`;
