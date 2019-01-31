import styled from "styled-components";

export default styled.div`
    display: flex;
    flex-direction: row;
    > :last-child {
        margin-left: .5rem !important;
    }
    > :nth-child(2) {
        order: -1;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        > :nth-child(2) {
            width: max-content;
            margin-left: 16px;
            align-self: flex-end;
            order: initial;
        }
    }
`;
