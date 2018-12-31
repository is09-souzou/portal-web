import styled from "styled-components";

export default styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    > * {
        margin: 1rem 0 1rem 6rem;
    }
    @media (max-width: 768px) {
        > * {
            margin-left: 1rem;
        }
}
`;
