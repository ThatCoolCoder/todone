import { createContext } from "react";
import { StateBundle } from "~/data/StateBundle";

export interface OpenableCardData {
    open: boolean,
    setOpen: (a: boolean) => void,
}

export const OpenableCardContext = createContext<OpenableCardData>({
    open: false,
    setOpen: () => {},
});