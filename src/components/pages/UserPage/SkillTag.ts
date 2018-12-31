import styled from "styled-components";

export default styled.div`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    min-width: 4rem;
    cursor: pointer;
    color: #444;
    padding: .1rem 1rem;
    transition: all .3s ease-out;
    border-radius: 32px;
    box-sizing: border-box;
    box-shadow: 0px 1px 1px 0px rgba(0,0,0,.3);
    :hover {
        box-shadow: 0px 2px 6px 0px rgba(0,0,0,.3);
        background-color: rgba(255, 255, 255, .3);
    }
    margin: 0.5rem 0.5rem 0 0;
`;
