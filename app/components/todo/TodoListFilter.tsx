import { Todo } from "~/data/Todo";
import { useContext, useEffect, useMemo, useState, } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Checkbox, Collapse, Fieldset, Group, Select, Stack } from "@mantine/core";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { StateBundle, makeStateBundle } from "~/data/StateBundle";
import { useTodoStore } from "~/context/TodoState";
import { useTodoChangeStore } from "~/context/TodoChangeState";

export type FilterFn = (a: Todo) => boolean;
export type SortFn = (a: Todo, b: Todo, c: Record<number, ExtraTodoData>) => number;

type ExtraTodoData = {
    created: number,
    modified: number,
}

const statusFilterFns: Record<string, FilterFn> = {
    "All": () => true,
    "Done only": a => a.done,
    "Not done only": a => ! a.done,
}

const sortFns: Record<string, SortFn> = {
    "Title": (a, b) => a.title.localeCompare(b.title),
    "Created": (a, b, extra) => extra[a.id]?.created - extra[b.id]?.created,
    "Modified": (a, b, extra) => extra[a.id]?.modified - extra[b.id]?.modified
}

export default function TodoListFilters({setFilterFn, setSortFn}: {setFilterFn: (a: FilterFn) => void, setSortFn: (a: SortFn) => void}) {
    const [opened, { toggle }] = useDisclosure(false);
    const changes = useTodoChangeStore(store => store.changes);
    const todos = useTodoStore(store => store.todos);

    const [statusFilter, setStatusFilter] = useState("All");
    const [sort, setSort] = useState("Title");
    const [normalWay, setNormalWay] = useState(true);

    const extraTodoData = useMemo(() => {
        let data: Record<number, ExtraTodoData> = {};
        for (let todo of todos) {
            let ourChanges = changes.filter(c => c.todoId == todo.id);
            data[todo.id] = {
                created: ourChanges.filter(c => c.type == "CREATED")[0]?.timestamp ?? 0,
                modified: ourChanges
                    .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp ?? 0
            }
        }
        return data;
    }, [todos, changes])

    useEffect(() => {
        setFilterFn(statusFilterFns[statusFilter]);
    }, [statusFilter]);

    useEffect(() => {
        setSortFn((a, b) => sortFns[sort](a, b, extraTodoData) * (normalWay ? 1 : -1));
    }, [sort, normalWay]);

    return <>
        <Fieldset p="0">
            <Group className="bg-neutral-700 px-4 cursor-pointer" onClick={toggle}>Filtering & Sorting
                {opened ? <ChevronUpIcon className="size-6" /> : <ChevronDownIcon className="size-6" />}</Group>

            <Collapse in={opened}>
                <Stack align="flex-start" className="p-4">
                    <StatusFilterSelector state={{val: statusFilter, set: setStatusFilter}} />
                    <Group>
                        <SortSelector state={makeStateBundle(sort, setSort)} />
                        <SortDirectionSelector state={makeStateBundle(normalWay, setNormalWay)} />
                    </Group>
                </Stack>
            </Collapse>
        </Fieldset>
    </>;
}

function StatusFilterSelector({state}: {state: StateBundle<string>}) {
    return <Select data={Object.keys(statusFilterFns)}
        label="Show"
        value={state.val}
        onChange={v => state.set(v ?? "All")}
        styles={{
            root: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "20px"
            }
        }}/>
}

function SortSelector({state}: {state: StateBundle<string>}) {
    return <Select data={Object.keys(sortFns)}
        label="Sort by"
        value={state.val}
        onChange={v => state.set(v ?? "All")}
        styles={{
            root: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "20px"
            }
        }}/>
}

function SortDirectionSelector({state}: {state: StateBundle<boolean>}) {
    return <Checkbox label="Ascending order?" checked={state.val} onChange={e => state.set(e.target.checked)} />
}