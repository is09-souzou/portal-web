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
            border-bottom: thin solid #BBB;
            padding-bottom: 0.3rem;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        tr {
            border-top: 1px solid #CCC;
        }
        th, td{
            border: 1px solid #CCC;
            padding: 6px 13px;
        }
    }
`;
