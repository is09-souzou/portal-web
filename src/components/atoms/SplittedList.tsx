import React, { useEffect, useState } from "react";
import styled from "styled-components";

export interface SpilittedListProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    items: T[];
    renderItem: (x: T) => React.ReactNode;
}

export default <T extends {}>(
    {
        items,
        renderItem,
        ...props
    }: SpilittedListProps<T>
) => {
    const [listRow, setListRow] = useState<number>(4);

    useEffect(
        () => {
            const resize = () => {
                const row = getRow();
                if (row !== listRow)
                    setListRow(row);
                else
                    setListRow(listRow);
            };
            resize();
            window.addEventListener("resize", resize);

            return () => window.removeEventListener("resize", resize);
        },
        []
    );

    return (
        <Host
            {...props}
        >
            {[...Array(listRow).keys()].map(x => (
                <div
                    key={x}
                    style={{
                        width: `calc(100% / ${listRow})`
                    }}
                >
                    {items
                        .filter((_, i) => i % listRow === x)
                        .map(renderItem)
                    }
                </div>
            ))}
        </Host>
    );
};

export const getRow = () => (
    window.innerWidth > 767 ?
        window.innerWidth > 1020 ? 4
      : window.innerWidth > 840  ? 3
      :                            2
  :
        window.innerWidth > 600  ? 3
      : window.innerWidth > 480  ? 2
      :                            1
);

const Host = styled.div`
    margin: 0 3rem;
    display: flex;
    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 1rem;
    }
`;
