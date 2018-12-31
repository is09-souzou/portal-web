import Avatar from "@material-ui/core/Avatar";
import styled from "styled-components";

export default styled(Avatar)`
    && {
        border: 1px solid #ccc;
        width: 10rem;
        height: 10rem;
        @media (max-width: 768px) {
            width: 6rem;
            height: 6rem;
        }
    }
`;
