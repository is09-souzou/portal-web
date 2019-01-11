import { createContext } from "react";

export type AppSyncClientValue = {
    client: any
};

// It is declared by React Component
// To make the compilation successful, temporary values ​​are included
export default createContext<AppSyncClientValue>({
    client: undefined
});
