import { TextInput, Textarea, Checkbox } from "@mantine/core";
import { StateBundle } from "~/data/StateBundle";
import { TodoEdit } from "./TodoCard";

export default function EditTodoThing({data}: {data: StateBundle<TodoEdit>}) {
    return <>
        <TextInput placeholder="Title of todo" width="30ch" fz="xl"
            value={data.val.title}
            onChange={e => data.set({...data.val, title: e.target.value})}/>
        <Checkbox label="Done"
            checked={data.val.done}
            onChange={e => data.set({...data.val, done: e.target.checked})}/>
        <Textarea placeholder="Description"
            value={data.val.body}
            onChange={e => data.set({...data.val, body: e.target.value})} />
    </>
}