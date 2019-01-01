import React from "react";
import { StaticContext } from "react-router";
import { Route, RouteComponentProps, RouteProps } from "react-router-dom";

export default (
    {
        component,
        path,
        ...props
    }: RouteProps
) => {
    return (
        <Route
            path={path}
            render={onRender(component as React.ComponentClass<any>, props)}
        />
    );
};

const onRender = (component: React.ComponentClass<any>, props: RouteProps) => (x: RouteComponentProps<any, StaticContext, any>) => {
    const Component = component;
    return <Component {...x} {...props} />;
};
