import { Badge, Button, ColorInput, Group, Stack, Table, TextInput, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { f } from "node_modules/react-router/dist/development/fog-of-war-BALYJxf_.mjs";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import OkCancelButtons from "~/components/misc/OkCancelButtons";
import TagBadge from "~/components/tag/TagBadge";
import { Tag } from "~/data/Tag";
import { setInitialTags, useTagStore } from "~/state/TagState";


export default function Tags() {
    document.title = "Tags | Todone";
    const init = useTagStore(store => store.init);
    useEffect(() => setInitialTags(init), []);

    return <TagsTable />
}

function TagsTable() {
    const [tags, add, update, remove] = useTagStore(useShallow(store => [store.tags, store.add, store.update, store.remove]))

    function openNewTagUi() {
        const newTag = {id: -1, title: "", description: "", color: "#ff0000"};
        // todo come up with new color thats different from others
        modals.open({
            title: "Add tag",
            size: "lg",
            children: <EditTagPopup tag={newTag} saveFunc={add} saveText="Create" />
        });
    }

    function openEditUi(tag: Tag) {
        modals.open({
            title: "Edit tag",
            size: "lg",
            children: <EditTagPopup tag={tag} saveFunc={update} saveText="Save changes" />
        });
    }

    function tryDelete(tag: Tag) {
        modals.openConfirmModal({
            title: "Confirm delete",
            labels: {confirm: "Confirm", cancel: "Cancel"},
            onConfirm: () => remove(tag)
        });
    }

    const head = <>
        <Table.Th w="20ch">
            {tags.length} {tags.length == 1 ? "tag" : "tags"}
        </Table.Th>
        <Table.Th>

        </Table.Th>
        <Table.Th w="20ch">
            <div className="text-right">
                <Button onClick={openNewTagUi}>New tag</Button>
            </div>
        </Table.Th>
    </>

    const rows = tags.map(t => <Table.Tr key={t.id}>
        <Table.Td w="20ch">
            <TagBadge tag={t} />
        </Table.Td>
        <Table.Td className="flex-1">
            {t.description}
        </Table.Td>
        <Table.Td w="20ch" className="text-right">
            <Button px={10} variant="subtle" onClick={() => openEditUi(t)}>Edit</Button>
            <Button px={10} variant="subtle" onClick={() => tryDelete(t)}>Delete</Button>
        </Table.Td>
    </Table.Tr>)

    return <>
        <p className="text-3xl mb-3">Tags</p>
        <div className="w-4xl">
            <Table>
                <Table.Thead>
                    <Table.Tr>{head}</Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    </>
}

function EditTagPopup({tag, saveFunc, saveText}: {tag: Tag, saveFunc: (a: Tag) => void, saveText: string}) {
    const [title, setTitle] = useState(tag.title);
    const [description, setDescription] = useState(tag.description);
    const [color, setColor] = useState(tag.color);

    return <Stack>
        <Group>
            <TextInput className="flex-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            <ColorInput className="shrink" value={color} onChange={e => setColor(e)} />
        </Group>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />

        <OkCancelButtons okText={saveText} okAction={() => saveFunc({id: tag.id, title, description, color})} />
    </Stack>
}