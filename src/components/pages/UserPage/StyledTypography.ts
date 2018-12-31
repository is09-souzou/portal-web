import Typography, { TypographyProps } from "@material-ui/core/Typography";
import styled from "styled-components";

export default styled(Typography as React.SFC<TypographyProps>)`
    && {
        font-size: 1.1rem;
        margin-left: 1.5rem;
        white-space: pre-wrap;
        letter-spacing: .1rem;
    }
`;
