import React from "react";
import { Typography }     from "@material-ui/core";
import styled             from "styled-components";
import { Work } from "../graphQL/type";

interface Props {
    works: Work[];
    workListRow: number;
    onWorkItemClick: (x: Work) => () => void;
}

export default (
    {
        works,
        workListRow,
        onWorkItemClick,
    }: Props
) => (
    <WorkList>
        {[...Array(workListRow).keys()].map(x => (
            <div
                key={x}
                style={{
                    width: `calc(100% / ${workListRow})`
                }}
            >
                {works
                    .filter((_, i) => i % workListRow === x)
                    .map(x => (
                        <WorkItem
                            work={x}
                            key={x.id}
                            onClick={onWorkItemClick(x)}
                        />
                    )
                )}
            </div>
        ))}
    </WorkList>
);

interface WorkItemProps extends React.HTMLAttributes<HTMLDivElement> {
    work: Work;
}

const WorkItem = (
    {
        work,
        ...props
    }: WorkItemProps
) => (
    <WorkItemBase
        {...props}
    >
        <WorkImage
            src={(
                work.imageUrl ? work.imageUrl
              :                 "/img/no-image.png"
            )}
        />
        <div>
            <Typography variant="caption">
                {work.user.displayName}
            </Typography>
            <Typography gutterBottom variant="title" component="h2">
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

const WorkList = styled.div`
    margin: 0 3rem;
    display: flex;
    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 1rem;
    }
`;

const WorkItemBase = styled.div`
    margin-bottom: 2rem;
    width: 100%;
`;
