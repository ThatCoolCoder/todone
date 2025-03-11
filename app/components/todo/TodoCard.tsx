import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Button, CheckIcon, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { TodosContext } from "~/context/TodosContext";
import { StateSetter } from "~/data/StateSetter";
import type { Todo } from "~/data/Todo";
import db from "~/services/database";
import OpenableCard from "~/components/misc/OpenableCard";
import EditTodo from "./EditTodo";
import { removeItem, updateItem } from "~/services/misc";

export default function TodoCard({ todo }: { todo: Todo }) {
    const [edit, setEdit] = useState(false);

    return <OpenableCard>
        <OpenableCard.Open>
            <BodyOpen todo={todo} edit={edit} setEdit={setEdit} />
        </OpenableCard.Open>
        <OpenableCard.Closed>
            <BodyClosed todo={todo} />
        </OpenableCard.Closed>
    </OpenableCard>
}

function BodyOpen({todo, edit, setEdit}: {todo: Todo, edit: boolean, setEdit: StateSetter<boolean>}) {
    const [editVals, setEditVals] = useState({title: todo.title, body: todo.body, done: todo.done})

    const allTodos = useContext(TodosContext);

    const navigate = useNavigate();

    function updateTodo() {
        let newTodo = {...todo, ...editVals};
        db.todos.update(newTodo);
        allTodos.set(updateItem(allTodos.val, todo));
    }

    function del() {
        modals.openConfirmModal({
            title: "Confirm delete",
            children: (<span>Are you sure you want to delete this todo?</span>),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => {},
            onConfirm: () => {
                db.todos.delete(todo.id);
                allTodos.set(removeItem(allTodos.val, todo));
            }
        })
    }

    function openHistory() {
        navigate(`/app/todos/${todo.id}/history`);
    }

    return <>
        <Group>
            <Stack flex={1}>
                {edit ? <>
                        <EditTodo data={{val: editVals, set: setEditVals}} />
                    </> : <>
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
                <Button onClick={openHistory} variant="outline" color="white" role="anchor"><ArrowTopRightOnSquareIcon className="size-6" /></Button>
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