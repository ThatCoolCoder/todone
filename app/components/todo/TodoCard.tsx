import { ArrowTopRightOnSquareIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Button, CheckIcon, Checkbox, Grid, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { StateSetter } from "~/data/StateSetter";
import type { Todo } from "~/data/Todo";
import db from "~/services/database";
import OpenableCard from "~/components/misc/OpenableCard";
import EditTodo from "./EditTodo";
import { removeFromArray, removeItem, updateItem } from "~/services/misc";
import { useTodoStore } from "~/state/TodoState";
import { useShallow } from "zustand/shallow";
import { useTagStore } from "~/state/TagState";
import TagBadge from "../tag/TagBadge";
import { Tag } from "~/data/Tag";
import { TagTodo } from "~/data/TagTodo";
import OkCancelButtons from "../misc/OkCancelButtons";

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

    function openEditTags() {
        modals.open({
            title: `Edit tags for ${todo.title}`,
            size: "lg",
            children: <EditTagsPopup todo={todo} />
        })
    }


    const [updateTodo, removeTodo] = useTodoStore(useShallow(state => [state.update, state.remove]));
    const [tags, tagTodos] = useTagStore(useShallow(store => [store.tags, store.tagTodos]));
    
    const [editVals, setEditVals] = useState({title: todo.title, body: todo.body, done: todo.done});

    const navigate = useNavigate();

    const ourTags = getTagsForTodo(todo, tags, tagTodos);
    

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
                <Group>{ourTags.length > 0 ? <>
                        { ourTags.map(tag => <TagBadge key={tag.id} tag={tag} />) }
                        <Button variant="outline" color="white" size="compact-sm" onClick={openEditTags}><PencilIcon className="size-6" /></Button>
                    </>: <>
                        <Text c="dimmed">No tags</Text>
                        <Button variant="outline" color="white" size="compact-sm" onClick={openEditTags}><PlusIcon className="size-6" /></Button>
                    </>
                }</Group>
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
                <Button onClick={() => navigate(`/app/todos/${todo.id}/history`)} variant="outline" color="white" role="anchor" title="Edit history"><ArrowTopRightOnSquareIcon className="size-6" /></Button>
            </Stack>
        </Group>
    </>
}

function BodyClosed({todo}: {todo: Todo}) {
    const [allTags, allTagTodos] = useTagStore(useShallow(store => [store.tags, store.tagTodos]));

    return <>
        <Group>
            <Text fz="xl">{todo.title}</Text>
            <Text c="dimmed">{todo.done ? "done" : "not done"}</Text>
            {getTagsForTodo(todo, allTags, allTagTodos).map(tag => <TagBadge key={tag.id} tag={tag} />)}
        </Group>
    </>
}

function getTagsForTodo(todo: Todo, tags: Tag[], tagTodos: TagTodo[]) {
    return tagTodos
        .filter(tt => tt.todoId == todo.id)
        .map(tt => tags.filter(t => t.id == tt.tagId)[0])
        .filter(x => x !== undefined);
}

function EditTagsPopup({todo}: {todo: Todo}) {
    const [allTags, allTagTodos, addLink, removeLink] = useTagStore(useShallow(store => [store.tags, store.tagTodos, store.addLink, store.removeLink]));
    
    let [tags, setTags] = useState<number[]>([]);
    let [originalTags, setOriginalTags] =  useState<number[]>([])

    useEffect(() => {
        let v = getTagsForTodo(todo, allTags, allTagTodos).map(x => x.id);
        setTags(v);
        setOriginalTags(v);
    }, []);

    function save() {
        // probably kinda inneficient because js doesnt have nice set functions, but its fine
        for (let oldTag of originalTags) {
            if (! tags.includes(oldTag)) removeLink(oldTag, todo.id);
        }
        for (let tag of tags) {
            if (! originalTags.includes(tag)) addLink(tag, todo.id);
        }
    }

    return <>
        <Stack>
            {allTags.map(tag => <Group key={tag.id}>
                <Checkbox checked={tags.includes(tag.id)}
                    onChange={e => setTags(e.target.checked ? [...tags, tag.id] : removeFromArray(tags, tag.id))} />
                <TagBadge tag={tag} />
            </Group>)}
        </Stack>
        <OkCancelButtons okText="Apply" cancelText="Cancel" okAction={save} />
    </>
}