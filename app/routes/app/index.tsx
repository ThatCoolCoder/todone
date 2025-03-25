import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Grid, Group, Text } from "@mantine/core";
import { modals } from '@mantine/modals';
import { useEffect, useState } from "react";

import { Todo } from "~/data/Todo";

import AddTodoPopup from "~/components/todo/AddTodoPopup";
import TodoCard from "~/components/todo/TodoCard";
import TodoListFilters, { FilterFn, SortFn } from "~/components/todo/TodoListFilter";
import { setInitialTodos, useTodoStore } from "~/state/TodoState";


export default function Index() {
    const init = useTodoStore(store => store.init);
    useEffect(() => setInitialTodos(init), []);

    document.title = "Todos | Todone";

    function addTodo() {
        modals.open({
            title: "Add todo",
            size: "lg",
            children: (
                <>
                {/* Modal is rendered in a portal (ie outside of context) so just give the data to him */}
                    <AddTodoPopup />
                </>
            )
        });
    }

    return <>
        <Group className="text-3xl mb-3" ml={0}>
            <p>Todos</p>
            <Button onClick={addTodo} variant="outline" color="white"><PlusIcon className="size-6" /></Button>
        </Group>
        <TodoList></TodoList>
    </>
}

function TodoList() {
    const todos = useTodoStore(state => state.todos);


    // react is a funny fells, if i pass in a filter function he thinks it's a function to generate initial state
    // (from TS we know that it cant be since inner returns true not FilterFn, but I guess typescript is leaking abstraction hmmm)
    // therefore we give him a function that generates the function.
    const [filterFn, setFilterFn] = useState<FilterFn>(() => (() => true));
    const [sortFn, setSortFn] = useState<SortFn>(() => ((a: Todo, b: Todo) => 1));

    const displayedTodos = todos.filter(filterFn);
    displayedTodos.sort(sortFn);

    return<>
        <TodoListFilters setFilterFn={f => setFilterFn(() => f)} setSortFn={f => setSortFn(() => f)}/>
        <br />
        <Grid>
            {displayedTodos.map(todo => 
                <Grid.Col key={todo.id}><TodoCard todo={todo} /></Grid.Col>
            )}
        </Grid>
        <br />
        {displayedTodos.length == 0 && <Text fz="large">No todos yet</Text>}
    </>
}