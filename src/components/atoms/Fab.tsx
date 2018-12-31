import Button, { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import styled from "styled-components";

const Fab = styled(Button as React.SFC<ButtonProps>)`
    && {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 2rem;
        @media (max-width: 768px) {
            bottom: 2rem;
        }
    }
`;

// TODO: https://github.com/styled-components/styled-components/issues/1695
export default (props: ButtonProps & { innerRef?: (instance: any) => void; }) =>
    <Fab color="primary" variant="fab" {...props}/>;
