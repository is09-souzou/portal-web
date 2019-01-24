import styled from "styled-components";

export default styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: flex-end;
    padding-bottom: .5rem;
    flex-grow: 1;
    > :nth-child(n + 1) {
        margin-left: .5rem;
    }

    @media (max-width: 768px) {
        margin-left: 0;
    }
`;
