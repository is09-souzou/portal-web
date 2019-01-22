import styled from "styled-components";

export default styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    > * {
        width: calc(50% - 1rem);
    }
    > :first-child {
        display: flex;
        flex-direction: column;
    }
    > :last-child {
        overflow: auto;
        margin-left: 2rem;
    }

    @media (max-width: 768px) {
        > * {
            width: initial;
        }
        > :last-child {
            display: none;
        }
    }
`;
