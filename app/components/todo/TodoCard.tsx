import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Button, CheckIcon, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { StateSetter } from "~/data/StateSetter";
import type { Todo } from "~/data/Todo";
import db from "~/services/database";
import OpenableCard from "~/components/misc/OpenableCard";
import EditTodo from "./EditTodo";
import { removeItem, updateItem } from "~/services/misc";
import { useTodoStore } from "~/context/TodoState";
import { useShallow } from "zustand/shallow";

export default function TodoCard({ todo }: { todo: Todo }) {
    const [edit, setEdit] = useState(false);

    return <OpenableCard canChangeState={! edit} >
        <OpenableCard.Open>
            <BodyOpen todo={todo} edit={edit} setEdit={setEdit} />
        </OpenableCard.Open>
        <OpenableCard.Closed>
            <BodyClosed todo={todo} />
        </OpenableCard.Closed>
    </OpenableCard>
}

function BodyOpen({todo, edit, setEdit}: {todo: Todo, edit: boolean, setEdit: StateSetter<boolean>}) {
    const [editVals, setEditVals] = useState({title: todo.title, body: todo.body, done: todo.done});

    const {todos, addTodo, updateTodo, removeTodo} = useTodoStore(
        useShallow(state => ({
            todos: state.todos,
            addTodo: state.add,
            updateTodo: state.update,
            removeTodo: state.remove,
        }))
    );

    const navigate = useNavigate();

    function update() {
        let newTodo = {...todo, ...editVals};
        updateTodo(newTodo);
    }

    function del() {
        modals.openConfirmModal({
            title: "Confirm delete",
            children: (<span>Are you sure you want to delete this todo?</span>),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => {},
            onConfirm: () => removeTodo(todo)
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
                        update();
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