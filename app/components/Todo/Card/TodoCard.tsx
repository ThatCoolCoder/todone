import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Card, Group, Text, Stack, Button, CheckIcon, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useContext, useState } from "react";
import type { Todo } from "~/data/Todo";
import db from "~/services/database";
import { TodosContext } from "~/context/TodosContext";
import EditTodoThing from "./EditTodoThing";
import { StateSetter } from "~/data/StateSetter";

const bannedSelectors = ["input", "button", "a", "input *", "button *", "a *"];

export type TodoEdit = {
    title: string,
    body: string,
    done: boolean
}

export default function TodoCard({ todo }: { todo: Todo }) {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);


    const allTodos = useContext(TodosContext);

    return <Card onClick={e => {
            // prevent clicking on internal buttons from doing stuff, might make this a utility function in future
            if (bannedSelectors.some(s => (e.target as HTMLElement).matches(s))) return;
            if (edit) return;
            e.preventDefault();
            setOpen(!open);
        }}>
        {!open && <BodyClosed todo={todo} />}
        {open && <BodyOpen todo={todo} edit={edit} setEdit={setEdit} />}
    </Card>
}

function BodyOpen({todo, edit, setEdit}: {todo: Todo, edit: boolean, setEdit: StateSetter<boolean>}) {
    const [editVals, setEditVals] = useState({title: todo.title, body: todo.body, done: todo.done})

    const allTodos = useContext(TodosContext);

    function updateTodo() {
        let newTodo = {...todo, ...editVals};
        db.todos.update(newTodo);
        const clone = allTodos.val.concat([]);
        clone.splice(clone.findIndex(t => t.id == todo.id), 1, newTodo);
        allTodos.set(clone);
    }

    function del() {
        modals.openConfirmModal({
            title: "Confirm delete",
            children: (<span>Are you sure you want to delete this todo?</span>),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => {},
            onConfirm: () => {
                db.todos.delete(todo.id);
                const clone = allTodos.val.concat([]);
                clone.splice(clone.findIndex(t => t.id == todo.id), 1);
                allTodos.set(clone);
            }
        })
    }

    return <>
        <Group>
            <Stack flex={1}>
                {edit ? 
                    <>
                        <EditTodoThing data={{val: editVals, set: setEditVals}} />
                    </> :
                    <>
                        <Text fz="xl">{todo.title}</Text>
                        <Text c="dimmed">{todo.done ? "done" : "not done"}</Text>
                        <Text>{todo.body || "(No body)"}</Text>
                    </>
                }
            </Stack>
            <Stack justify="flex-start">
                <Button onClick={del} color="white" variant="outline" size="compact-md"><TrashIcon className="size-6" /></Button>
                {edit ? 
                    <Button onClick={() => {
                        setEdit(false);
                        updateTodo();
                    }} color="white" variant="outline" size="compact-md"><CheckIcon className="size-6" /></Button>
                    :
                    <Button onClick={() => setEdit(true)} color="white" variant="outline" size="compact-md"><PencilIcon className="size-6" /></Button>
                }
            </Stack>
        </Group>
    </>
}

function BodyClosed({todo}: {todo: Todo}) {
    return <>
        <Group>
            <Text fz="xl">{todo.title}</Text>
            <Text c="dimmed">{todo.done ? "done" : "not done"}</Text>
        </Group>
    </>
}