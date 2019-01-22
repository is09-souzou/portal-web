import styled from "styled-components";

export default styled.div`
    display: flex;
    > :first-child {
        flex-grow: 1
    }
    > * {
        margin-left: .5rem !important;
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;
