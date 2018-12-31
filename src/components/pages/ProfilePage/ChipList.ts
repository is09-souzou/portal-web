import styled from "styled-components";

export default styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: flex-end;
    padding-bottom: .5rem;
    flex-grow: 1;
    flex-wrap: wrap;
    > :nth-child(n + 1) {
        margin: .5rem 0 0 .5rem;
    }
    @media (max-width: 768px) {
        margin-left: initial;
    }
`;
