import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import styled from "styled-components";

export default styled(DialogContent as React.SFC<DialogContentProps>)`
    && {
        width: 20rem;
        max-width: 20rem;
        display: flex;
        flex-direction: column;
    }
`;
