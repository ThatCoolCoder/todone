import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Button, Card, Checkbox, Collapse, Fieldset, Grid, Group, OptionsDropdown, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from '@mantine/modals';
import { useContext, useEffect, useState } from "react";

import AddTodoPopup from "~/components/Todo/AddTodoPopup";
import TodoCard from "~/components/Todo/TodoCard";
import { TodosContext } from "~/context/TodosContext";
import { StateBundle } from "~/data/StateBundle";
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
            <TodoList></TodoList>
        </TodosContext.Provider>
    </>
}

function TodoList() {
    const allTodos = useContext(TodosContext);

    // const init: FilterFn = ;
    const [filterFn, setFilterFn] = useState<FilterFn>(() => (() => true)); // react is a funny fella, he thinks my intial state is a function to generate initial state
    const [sortFn, setSortFn] = useState<SortFn>(() => ((a: Todo, b: Todo) => 1));

    const displayedTodos = allTodos.val.filter(filterFn);
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




type FilterFn = (a: Todo) => boolean;
type SortFn = (a: Todo, b: Todo) => number;

const statusFilterFns: Record<string, FilterFn> = {
    "All": () => true,
    "Done only": a => a.done,
    "Not done only": a => ! a.done,
}

const sortFns: Record<string, SortFn> = {
    "Title": (a, b) => a.title.localeCompare(b.title),
    "Modified": (a, b) => a.body.localeCompare(b.body)
}

function TodoListFilters({setFilterFn, setSortFn}: {setFilterFn: (a: FilterFn) => void, setSortFn: (a: SortFn) => void}) {
    const [opened, { toggle }] = useDisclosure(false);

    const [statusFilter, setStatusFilter] = useState("All");
    // todo: date filter

    const [sort, setSort] = useState("Title");
    const [normalWay, setNormalWay] = useState(true);

    useEffect(() => {
        setFilterFn(statusFilterFns[statusFilter]);
    }, [statusFilter]);

    useEffect(() => {
        setSortFn((a, b) => sortFns[sort](a, b) * (normalWay ? 1 : -1));
    }, [sort, normalWay]);

    return <>
        <Fieldset p="0">
            <Group className="bg-neutral-700 px-4 cursor-pointer" onClick={toggle}>Filtering & Sorting
                {opened ? <ChevronUpIcon className="size-6" /> : <ChevronDownIcon className="size-6" />}</Group>

            <Collapse in={opened}>
                <Stack align="flex-start" className="p-4">
                    <Select data={Object.keys(statusFilterFns)}
                        label="Show"
                        value={statusFilter}
                        onChange={v => setStatusFilter(v ?? "All")}
                        styles={{
                            root: {
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "20px"
                            }
                        }}/>
                    <Group>
                        <Select data={Object.keys(sortFns)}
                            label="Sort by"
                            value={sort}
                            onChange={v => setSort(v ?? "All")}
                            styles={{
                                root: {
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "20px"
                                }
                            }}/>
                            <Checkbox label="Ascending order?" checked={normalWay} onChange={e => setNormalWay(e.target.checked)} />
                    </Group>
                </Stack>
            </Collapse>
        </Fieldset>
    </>;
}