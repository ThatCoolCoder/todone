import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Group } from "@mantine/core";
import { modals } from '@mantine/modals';
import { useEffect, useState } from "react";

import AddTodoPopup from "~/components/Todo/AddTodoPopup";
import TodoList from "~/components/Todo/TodoList";
import { TodosContext } from "~/context/TodosContext";
import { Todo } from "~/data/Todo";
import db from "~/services/database";


export default function Index() {
    document.title = "Todos | Todone";

    let [val, set] = useState([] as Todo[]);

    useEffect(() => {
        db.todos.getAll().then(d => set(d));
    }, []);

    const allTodos = {val, set};

    function addTodo() {
        modals.open({
            title: "Add todo",
            size: "lg",
            children: (
                <>
                {/* Modal is rendered outside of context so just give it to him */}
                    <AddTodoPopup allTodos={allTodos} />
                </>
            )
        });
    }

    return <>
        <TodosContext.Provider value={allTodos}>
            <Group className="text-3xl mb-3" ml={0}>
                <p>Todos</p>
                <Button onClick={addTodo} variant="outline" color="white"><PlusIcon className="size-6" /></Button>
            </Group>
            <div>
                <TodoList hideDone={false}></TodoList>
            </div>
        </TodosContext.Provider>
    </>
}