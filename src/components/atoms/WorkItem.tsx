import { Typography } from "@material-ui/core";
import React from "react";
import { Work } from "src/graphQL/type";
import styled from "styled-components";

interface WorkItemProps extends React.HTMLAttributes<HTMLDivElement> {
    work: Work;
}

export default (
    {
        work,
        ...props
    }: WorkItemProps
) => (
    <WorkItemBase
        {...props}
        unselectable={undefined}
    >
        <WorkImage
            src={(
                work.imageUrl ? work.imageUrl : "/img/no-image.png"
            )}
        />
        <div>
            <Typography variant="caption">
                {work.user && work.user.displayName}
            </Typography>
            <Typography gutterBottom variant="h6" component="h2">
                {work.title}
            </Typography>
        </div>
    </WorkItemBase>
);

const WorkImage = styled.img`
    width: 100%;
    border-radius: 8px;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    :hover {
        background-color: #fff;
        transform: scale(1.1);
        box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
    }
`;

const WorkItemBase = styled.div`
    margin-bottom: 2rem;
    width: 100%;
`;
