
import * as H from "history";
import { createContext } from "react";

export type RouterHistoryValue = {
    history: H.History
};

// It is declared by React Component
// To make the compilation successful, temporary values ​​are included
export default createContext<RouterHistoryValue>({
    // TODO: fix
    history: H.createHashHistory()
});
