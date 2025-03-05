import { StateBundle } from "~/data/StateBundle";
import { TodoChange } from "~/data/TodoChange";
import { createContext } from "react";

export const ChangesContext = createContext<StateBundle<TodoChange[]>>(
    {val: [], set: () => {}});