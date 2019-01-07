import React from "react";
import { Switch } from "react-router-dom";

export default (
    {
        children,
        ...props
    }: React.Props<{}>
) => (
    <Switch>
        {React.Children.toArray(children).map(
            (x: any) => React.cloneElement(
                x,
                {
                    ...props,
                    ...x.props
                }
            )
        )}
    </Switch>
);
