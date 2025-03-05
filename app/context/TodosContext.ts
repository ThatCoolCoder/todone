import { StateBundle } from "~/data/StateBundle";
import { Todo } from "~/data/Todo";
import { createContext } from "react";

export const TodosContext = createContext<StateBundle<Todo[]>>(
    {val: [], set: () => {}});