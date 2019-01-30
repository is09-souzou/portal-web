import React from "react";
import LocationText from "src/components/atoms/LocationText";
import Page from "src/components/atoms/Page";
import Header from "src/components/molecules/Header";
import styled from "styled-components";

const StyledPage = styled(Page)`
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
    > :nth-child(2) {
        > :nth-child(1) {
                > :nth-child(n + 1) {
                    margin-top: 4rem;
                }
            }
        }
    @media (max-width: 768px) {
        width: unset;
        margin: 0 4rem;
    }
`;

export default (
    {
        children,
        ref,
        ...props
    }: React.Props<{}>
) => (
    <StyledPage ref={ref as any} {...props}>
        <Header
            title={<LocationText text="Settings"/>}
            searchable={false}
        />
        <div>
            {children}
        </div>
    </StyledPage>
);
