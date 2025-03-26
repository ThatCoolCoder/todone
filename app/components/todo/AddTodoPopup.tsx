import {Stack, Group, TextInput, Textarea, Checkbox} from "@mantine/core";
import { useState } from "react";
import { modals } from '@mantine/modals';
import { useTodoStore } from "~/state/TodoState";
import OkCancelButtons from "../misc/OkCancelButtons";

export default function AddTodoPopup() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [done, setDone] = useState(false);

    const addTodo = useTodoStore(store => store.add);

    return <Stack>
        <Group>
            <TextInput placeholder="Title of todo" width="30ch" flex={1} value={title} onChange={e => setTitle(e.target.value)}/>
            <Checkbox label="Mark as done?" onChange={e => setDone(e.target.checked)}/>
        </Group>
        <Textarea placeholder="Description" onChange={e => setBody(e.target.value)} />
        <OkCancelButtons okText="Create" cancelText="Cancel" okAction={() => addTodo({id: -1, title, body, done})} />
    </Stack>
}