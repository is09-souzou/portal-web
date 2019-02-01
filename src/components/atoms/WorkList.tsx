import React from "react";
import SplittedList from "src/components/atoms/SplittedList";
import WorkItem from "src/components/atoms/WorkItem";
import { Work } from "src/graphQL/type";

interface Props {
    works: Work[];
    onWorkItemClick: (x: Work) => void;
}

export default (
    {
        works,
        onWorkItemClick,
    }: Props
) => (
    <SplittedList
        items={works}
        renderItem={x => (
            <WorkItem
                work={x}
                key={x.id}
                onClick={() => onWorkItemClick(x)}
            />
        )}
    />
);
