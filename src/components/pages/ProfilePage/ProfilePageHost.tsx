import React from "react";
import Header from "src/components/molecules/Header";
import PageHost from "src/components/pages/ProfilePage/PageHost";

export default (
    {
        ref,
        children,
        ...props
    }: React.Props<{}>
) => (
    <PageHost ref={ref as any} {...props}>
        <Header/>
        <div>
            {children}
        </div>
    </PageHost>
);
