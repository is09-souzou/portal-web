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
        blockquote {
            color: #666;
            margin: 0;
            padding-left: 3em;
            border-left: 0.5em #eee solid;
        }
        code {
            background: #EEE;
            color: #333;
            display: block;
            overflow-x: auto;
            padding: 0.5em;
        }
        h1 {
            padding-bottom: 0.5rem;
        }
        h2 {
            border-bottom: thin solid #BBB;
            padding-bottom: 0.3rem;
        }
        hr {
            color: #BBB;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        td, th{
            border: 1px solid #CCC;
            padding: 6px 13px;
        }
        tr {
            border-top: 1px solid #CCC;
        }
        pre {
            border: 1px solid #ccc;
        }
    }
`;
