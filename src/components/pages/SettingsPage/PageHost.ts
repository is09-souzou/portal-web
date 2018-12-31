import styled from "styled-components";
import Page   from "src/components/atoms/Page";

export default styled(Page)`
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
    > :nth-child(2) {
        > :nth-child(1) {
                > :nth-child(n + 1) {
                    margin-top: 4rem;
                }
            }
        }
    @media (max-width: 768px) {
        width: unset;
        margin: 0 4rem;
    }
`;
