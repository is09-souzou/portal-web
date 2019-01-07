import { createContext } from "react";
import locationTextList, { LocationText } from "src/localization/locale";

export type LocalizationValue = {
    locationText: LocationText;
    handleLocale: () => void
};

// It is declared by React Component
// To make the compilation successful, temporary values ​​are included
export default createContext<LocalizationValue>({
    locationText: locationTextList["us"],
    handleLocale: () => undefined
});
