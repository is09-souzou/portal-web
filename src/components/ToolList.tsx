import styled   from "styled-components";

export default styled.div`
    display: flex;
    border: 1px solid #aaa;
    border-radius: 4px;
    width: fit-content;
    > :nth-child(n + 2) {
        border-left: 1px solid #aaa;
    }
`;
