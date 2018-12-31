import React, { ReactNode } from "react";
import styled               from "styled-components";

interface Props {
    children: ReactNode;
    selectedIndex: number;
}

export default (
    {
        children,
        selectedIndex,
        ...props
    }: Props
) => (
    <Component>
       {React.Children.toArray(children).map(
            (x: any) => React.cloneElement(
                x,
                {
                    style: {
                        transform: `translate3d(${ -100 * selectedIndex }%, 0, 0)`,
                    },
                    ...props
                }
            )
        )}
    </Component>
);

const Component = styled.div`
    display: flex;
    overflow: hidden;
    > * {
        position: relative;
        overflow: auto;
        max-width: 100%;
        min-width: 100%;
        transition: all .3s ease-out;
    }
`;
