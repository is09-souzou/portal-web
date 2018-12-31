import styled from "styled-components";

export default styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem 6rem 1rem 6rem;
    > :nth-child(3) {
        display: flex;
        > :first-child {
            min-width: max-content;
            max-width: max-content;
        }
    }
    > :last-child {
        display; flex;
        margin-left: auto;
        > * {
            margin-left: .5rem;
        }
    }
    @media (max-width: 768px) {
        margin: 1rem 2rem;
        > :nth-child(3) {
            display: flex;
            flex-direction: column;
        }
    }
`;
