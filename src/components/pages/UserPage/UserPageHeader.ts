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
        height: 5rem;
        align-items: center;
        margin-left: 5rem;
        > :first-child {
            margin-bottom: 5rem;
        }
        > :last-child {
            margin-top: auto;
            margin-left: auto;
            visibility: visible;
        }
        @media (max-width: 768px) {
            margin-left: 1rem;
            > :last-child {
                visibility: hidden;
            }
        }
    }
`;
