import { createContext } from "react";

export type NotificationFn = (type: "info" | "error", message: string) => void;
export type NotificationValue = {
    ErrorComponent: any,
    notification  : NotificationFn
};

// It is declared by React Component
// To make the compilation successful, temporary values ​​are included
export default createContext<NotificationValue>({
    ErrorComponent: {},
    notification: () => undefined
});
