import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Checkbox, Group, TextInput, Textarea, Stack } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import TodoList from "~/components/Todo/TodoList";
import { TodosContext } from "~/context/TodosContext";
import { modals } from '@mantine/modals';
import db from "~/services/database";
import AddTodoPopup from "~/components/Todo/AddTodoPopup";
import { ModalsProvider } from "@mantine/modals";
import { Todo } from "~/data/Todo";

export default function Index() {
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