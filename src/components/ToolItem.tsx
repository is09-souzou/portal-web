import styled   from "styled-components";

export default styled.div`
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all .2s ease-out;
    cursor: pointer;
    :hover {
        background: rgba(0, 0, 0, .1);
    }
`;
