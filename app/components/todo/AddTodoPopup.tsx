import {Stack, Group, TextInput, Textarea, Checkbox, Button} from "@mantine/core";
import { useState } from "react";
import { modals } from '@mantine/modals';
import db from "~/services/database";
import { StateBundle } from "~/data/StateBundle";
import { Todo } from "~/data/Todo";
import { useTodoStore } from "~/state/TodoState";

export default function AddTodoPopup() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [done, setDone] = useState(false);

    const addTodo = useTodoStore(store => store.add);

    function save() {
        let todo = {
            id: -1,
            title,
            body,
            done
        };
        addTodo(todo);

        modals.closeAll();
    }

    return <Stack>
        <Group>
            <TextInput placeholder="Title of todo" width="30ch" flex={1} value={title} onChange={e => setTitle(e.target.value)}/>
            <Checkbox label="Mark as done?" onChange={e => setDone(e.target.checked)}/>
        </Group>
        <Textarea placeholder="Description" onChange={e => setBody(e.target.value)} />
        <Group justify="flex-end">
            <Button variant="default" onClick={modals.closeAll}>Cancel</Button>
            <Button onClick={save}>Create</Button>
        </Group>
    </Stack>
}