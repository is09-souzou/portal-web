import styled from "styled-components";

export default styled.div`
    display: flex;
    flex-direction: column;
    > :first-child {
        height: 10rem;
        object-fit: cover;
    }
    > :last-child {
        display: flex;
        height: 8rem;
        align-items: center;
        margin-left: 5rem;
        > :first-child {
            margin-bottom: 2rem;
        }
        > :last-child {
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
        }
        @media (max-width: 768px) {
            margin-left: 1rem;
        }
    }
`;
