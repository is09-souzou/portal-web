import React from "react";
import Page from "src/components/atoms/Page";
import Header from "src/components/molecules/Header";
import styled from "styled-components";

const Host = styled(Page)`
    display: flex;
    flex-direction: column;
    margin-top: -7rem;
    padding-bottom: 7rem;
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
        <Header/>
        <div>
            {children}
        </div>
    </Host>
);
