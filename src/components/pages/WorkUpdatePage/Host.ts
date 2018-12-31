import styled from "styled-components";

export default styled.form`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 2rem;
    width: calc(100% - 4rem);
    > * {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
`;
