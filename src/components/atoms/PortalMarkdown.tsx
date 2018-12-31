import React         from "react";
import ReactMarkdown from "react-markdown";
import styled        from "styled-components";

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
            border-bottom: 2px solid red;
        }
    }
`;
