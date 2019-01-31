import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
const breaks = require("remark-breaks");

export default (
    props: ReactMarkdown.ReactMarkdownProps
) => (
    <MarkdownStyles>
        <ReactMarkdown
            {...props}
            plugins={[breaks]}
        />
    </MarkdownStyles>
);

const MarkdownStyles = styled.div`
    & {
        blockquote {
            color: #555;
            margin: 0;
            padding-left: 1rem;
            border-left: 0.3rem #555 solid;
        }

        h1 {
            padding-bottom: 0.5rem;
        }

        h2 {
            border-bottom: thin solid #bbb;
            padding-bottom: 0.3rem;
        }

        hr {
            color: #bbb;
        }

        table {
            border-spacing: 0;
            border-collapse: collapse;
        }

        td,
        th {
            border: 1px solid #ccc;
            padding: .5rem 1rem;
        }

        tr {
            border-top: 1px solid #ccc;
        }

        pre {
            margin: .5rem;
            border-radius: 4px;
            padding: .5rem 1rem;
            border: 1px solid #333;
            background-color: #282c34;
            color: white;
        }
    }
`;
