import styled from "styled-components";

export default styled.div`
    display: flex;
    flex-direction: column;
    > :nth-child(1) {
        margin-bottom: 1rem;
    }
    > :nth-child(2) {
        display: flex;
    }

    @media (max-width: 768px) {
        > :nth-child(2) {
            flex-direction: column;
        }
    }
`;
