import { useState, useEffect, ReactNode } from "react";
import db from "~/services/database";
import { Todo } from "~/data/Todo";
import { TodosContext } from "~/context/TodosContext";

export default function TodoSource({children}: {children: ReactNode}) {
    const [todos, setTodos] = useState([] as Todo[])

    useEffect(() => {
        db.todos.getAll().then(todos => {
            setTodos(todos);
        });
    }, []);

    return <TodosContext.Provider value={{val: todos, set: setTodos}}>
        {children}
    </TodosContext.Provider>
}