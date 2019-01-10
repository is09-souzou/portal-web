import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

export default (
    props: ReactMarkdown.ReactMarkdownProps
) => (
    <MarkdownStyles>
        <ReactMarkdown
            {...props}
        />
    </MarkdownStyles>
);

const MarkdownStyles = styled.div`
    & {
        h1 {
            padding-bottom: 0.5rem;
        }
        h2 {
            border-bottom-color: #BBB;
            border-bottom-style: solid;
            border-bottom-width: thin;
            padding-bottom: 0.3rem;
        }
    }
`;
