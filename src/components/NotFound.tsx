import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

const messages = ["(＝△＝)", "(´・ω・`)", "(＿´Д｀)", "(= ‐ω‐ =)", "(*ノω・*)"];

export default () => (
    <Host>
        <Typography
            variant="display4"
        >
            {messages[Math.floor(Math.random() * messages.length)]}
        </Typography>
        <Typography
            variant="display3"
        >
            Not Found
        </Typography>
    </Host>
);

const Host = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
`;