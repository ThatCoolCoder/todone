import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ActionIcon, Button, CheckIcon, Checkbox, Group, Table, TextInput, Textarea } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { setInitialTodos, useTodoStore } from "~/state/TodoState";
import { Todo } from "~/data/Todo";

export default function TableView() {
    const init = useTodoStore(store => store.init);
    useEffect(() => setInitialTodos(init), []);

    const {todos, addTodo, updateTodo, removeTodo} = useTodoStore(
        useShallow(state => ({
            todos: state.todos,
            addTodo: state.add,
            updateTodo: state.update,
            removeTodo: state.remove,
        }))
    );

    document.title = "Table View | Todone";

    const [editedTodo, setEditedTodo] = useState(null as Todo | null);

    const head = <Table.Tr>
        <Table.Th>Title</Table.Th>
        <Table.Th>Done</Table.Th>
        <Table.Th>Body</Table.Th>
        <Table.Th>
            <Button onClick={add}>Add</Button>
        </Table.Th>
    </Table.Tr>


    function add() {
        if (editedTodo != null) return;
        setEditedTodo({
            id: -1,
            title: "",
            done: false,
            body: ""
        });
    }

    function save(todo: Todo) {
        if (todo.id == -1) addTodo(todo);
        else updateTodo(todo);
        setEditedTodo(null);
    }

    function del(todo: Todo) {
        if (todo.id != -1) removeTodo(todo);
        setEditedTodo(null);
    }

    const displayed = useMemo(() => {
        return (editedTodo != null && editedTodo.id == -1 ? [editedTodo] : []).concat(todos);
    }, [todos, editedTodo]);

    const rows = displayed.map(todo => (editedTodo != null && editedTodo.id == todo.id) ? (
        <Table.Tr key={todo.id}>
            <Table.Td>
                <TextInput value={editedTodo.title} onChange={v => setEditedTodo({...editedTodo, title: v.target.value})} />
            </Table.Td>
            <Table.Td>
                <Checkbox checked={editedTodo.done} onChange={e => setEditedTodo({...editedTodo, done: e.target.checked})} /> 
            </Table.Td>
            <Table.Td>
                <TextInput value={editedTodo.body} onChange={v => setEditedTodo({...editedTodo, body: v.target.value})} />    
            </Table.Td>
            <Table.Td>
                <Group gap={2}>
                    <ActionIcon onClick={() => save(editedTodo)}><CheckIcon className="size-4" /></ActionIcon>
                    <ActionIcon onClick={() => setEditedTodo(null)}><XMarkIcon className="size-6" /></ActionIcon>
                    <ActionIcon onClick={() => del(editedTodo)}><TrashIcon className="size-6" /></ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ) : (
        <Table.Tr key={todo.id}>
            <Table.Td>{todo.title}</Table.Td>
            <Table.Td>{todo.done ? "yes" : "no"}</Table.Td>
            <Table.Td>{todo.body}</Table.Td>
            <Table.Td>
                <Button onClick={() => setEditedTodo({...todo})}>Edit</Button>
            </Table.Td>
        </Table.Tr>
    ));
    
    return <>
        <p className="text-3xl">Todos (table view)</p>
        <br />
        <Table>
            <Table.Thead>{head}</Table.Thead>

            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    </>
}