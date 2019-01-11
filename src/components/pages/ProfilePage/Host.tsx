import React from "react";
import LocationText from "src/components/atoms/LocationText";
import Page from "src/components/atoms/Page";
import Header from "src/components/molecules/Header";
import styled from "styled-components";

const Host = styled(Page)`
    display: flex;
    flex-direction: column;
    transition: all .3s ease-out;
`;

export default (
    {
        ref,
        children,
        ...props
    }: React.Props<{}>
) => (
    <Host ref={ref as any} {...props}>
        <Header
            title={<LocationText text="Profile"/>}
        />
        <div>
            {children}
        </div>
    </Host>
);
