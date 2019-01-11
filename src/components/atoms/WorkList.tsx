import React from "react";
import WorkItem from "src/components/atoms/WorkItem";
import { Work } from "src/graphQL/type";
import styled from "styled-components";

interface Props {
    works: Work[];
    workListRow: number;
    onWorkItemClick: (x: Work) => void;
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
                            onClick={() => onWorkItemClick(x)}
                        />
                    )
                )}
            </div>
        ))}
    </WorkList>
);

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
