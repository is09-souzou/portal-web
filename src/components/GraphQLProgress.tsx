import React from "react";
import styled from "styled-components";
import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";

export default (props: CircularProgressProps) => (
    <Host>
        <CircularProgress {...props}/>
    </Host>
);

const Host = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
