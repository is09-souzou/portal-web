import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import styled from "styled-components";

const ShortTextField = styled(TextField as React.SFC<TextFieldProps>)`
    && {
        max-width: 18rem;
    }
`;

export default  ({
    ...props
}) => (
    <ShortTextField
        defaultValue=""
        classes={undefined}
        className={undefined}
        style={undefined}
        onChange={undefined}
        innerRef={undefined}
        value={undefined}
        variant={undefined}
        inputProps={undefined}
        InputProps={undefined}
        inputRef={undefined}
        rows={undefined}
        rowsMax={undefined}
        {...props}
    />
);
