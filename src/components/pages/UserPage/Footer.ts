import styled from "styled-components";

export default styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    visibility: hidden;
    @media (max-width: 768px) {
        visibility: visible;
    }
`;
