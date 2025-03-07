import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Button, Card, Collapse, Fieldset, Grid, Group, OptionsDropdown, Select, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from '@mantine/modals';
import { useContext, useEffect, useState } from "react";

import AddTodoPopup from "~/components/Todo/AddTodoPopup";
import TodoCard from "~/components/Todo/TodoCard";
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
                {/* Modal is rendered in a portal (ie outside of context) so just give the data to him */}
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
            <br />
            <TodoList hideDone={false}></TodoList>
        </TodosContext.Provider>
    </>
}

function TodoList({hideDone}: {hideDone: boolean}) {
    const allTodos = useContext(TodosContext);

    const displayedTodos = hideDone ? allTodos.val.filter(t => ! t.done) : allTodos.val;

    return<>
        <TodoListFilters />
        <br />
        <Grid>
            {allTodos.val.map(todo => 
                <Grid.Col key={todo.id}><TodoCard todo={todo} /></Grid.Col>
            )}
        </Grid>
        <br />
        {displayedTodos.length == 0 && <Text fz="large">No todos yet</Text>}
    </>
}


enum DoneFilteringOptions {
    All,
    Done,
    NotDone
}

const names = {
    [DoneFilteringOptions.All] : "All",
    [DoneFilteringOptions.Done] : "Done",
    [DoneFilteringOptions.NotDone] : "NotDone",
};

function TodoListFilters() {
    const [opened, { toggle }] = useDisclosure(false);

    const [doneFiltering, setDoneFiltering] = useState(DoneFilteringOptions.NotDone);

    return <>
        <Fieldset p="0">
            <Group className="bg-neutral-700 px-4 cursor-pointer" onClick={toggle}>Filtering {opened ? <ChevronUpIcon className="size-6" /> : <ChevronDownIcon className="size-6" />}</Group>

            <Collapse in={opened}>
                <div className="p-4">
                filter yes hehe
            </Collapse>
        </Fieldset>
    </>;
}