import { Card, Checkbox, Grid, Stack, Text } from "@mantine/core";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import { Todo } from "~/data/Todo";
import { TodoChange, TodoChangeType, TodoEdited, TodoRelatedEntityType, TodoRelationUpdateType, TodoRelationUpdated } from "~/data/TodoChange";
import db from "~/services/database";
import { groupBy } from "~/services/misc";
import { Route } from "../../+types";
import { setInitialChanges, useTodoChangeStore } from "~/state/TodoChangeState";
import { useShallow } from "zustand/react/shallow";
import { setInitialTags, useTagStore } from "~/state/TagState";
import TagBadge from "~/components/tag/TagBadge";

export default function History(loaderData: Route.ComponentProps) {
    const [init, changes] = useTodoChangeStore(useShallow(store => [store.init, store.changes]));
    const [init2, tags] = useTagStore(useShallow(store => [store.init, store.tags]));
    useEffect(() => {
        setInitialChanges(init);
        setInitialTags(init2);
    }, []);

    const id = Number(loaderData.params.id);
    const [todo, setTodo] = useState(null as Todo | null);
    useEffect(() => {
        db.todos.get(id).then(t => setTodo(t));
    }, []);

    document.title = "History | Todone";

    return <>
        <p className="text-3xl">History for <Link to="/app/"><b>"{todo?.title ?? "---"}"</b></Link></p>
        <br />
        {changes == null ? <>
            Loading change list
        </> : <>
            {changes.length == 0 ? <>
                No Changes
            </> : <>
                <ChangeList todoId={id} />
            </>}
        </>}
    </>
}


// Some slightly messy stuff that combines multiple simultaneous edits into 1,
// because on the backend we decided to not keep track of edits happening together.
// will do better next time

interface ChangeSet {
    timestamp: number,
    type: TodoChangeType,
}

interface FieldEdit {
    field: string,
    oldValue: string,
    newValue: string,
}

interface EditSet extends ChangeSet {
    changes: FieldEdit[]
}

interface LinkageEdit {
    relatedEntityType: TodoRelatedEntityType,
    relatedEntityId: number,
    updateType: TodoRelationUpdateType
}

interface RelationUpdateSet extends ChangeSet { 
    changes: LinkageEdit[]
}

function ChangeList({todoId}: {todoId: number}) {
    const changes = useTodoChangeStore(store => store.changes);

    const [mostRecentFirst, setMostRecentFirst] = useState(true);

    const editSets: ChangeSet[] =
        groupBy(changes.filter(c => c.todoId == todoId),
            c => c.timestamp.toString() + "-" + c.type) // group by time and type
        .map(group => ({
            timestamp: group.items[0].timestamp,
            type: group.items[0].type,
            changes: combineChanges(group.items)
        }));
    
    function combineChanges(items: TodoChange[]) {
        if (items[0].type == "CREATED") {
            return [];
        } else if (items[0].type == "EDITED") {
            let edits = items as TodoEdited[];
            return edits.map(i => ({
                field: i.field,
                oldValue: i.oldValue,
                newValue: i.newValue
            }));
        } else if (items[0].type == "RELATION_UPDATED") {
            let edits = items as TodoRelationUpdated[];
            return edits.map(i => ({
                relatedEntityType: i.relatedEntityType,
                relatedEntityId: i.relatedEntityId,
                updateType: i.updateType,
            }));
        } else {
            throw new Error("should be impossible");
        }
    }

    let sorted = editSets.concat([]);
    sorted.sort((a, b) => a.timestamp - b.timestamp);
    if (mostRecentFirst) sorted.reverse();

    console.log(sorted);


    return <>
        <Checkbox label="Display most recent first?" checked={mostRecentFirst} onChange={e => setMostRecentFirst(e.target.checked)} />
        <br />
        <Grid>
            {sorted.map(set => <ShowChangeSetDetails key={set.timestamp} set={set}/> )}
        </Grid>
    </>
}

function ShowChangeSetDetails({set}: {set: ChangeSet}) {
    return <Grid.Col key={set.timestamp}>
        <Card>
            <Stack>
                {
                    set.type == "CREATED" && <CreatedContent set={set} />
                    || set.type == "EDITED" && <EditedContent set={set as EditSet} />
                    || set.type == "RELATION_UPDATED" && <RelationUpdatedContent set={set as RelationUpdateSet} />
                }
            </Stack>
        </Card>
    </Grid.Col>
}

function CreatedContent({set}: {set: ChangeSet}) {
    return <div>
        <Text fz="xl" mb="0">Created</Text>
        <Text c="dimmed">{new Date(set.timestamp).toLocaleString()}</Text>
    </div>
}

function EditedContent({set}: {set: EditSet}) {
    return <>
        <div>
            <Text fz="xl" mb="0">Modified</Text>
            <Text c="dimmed">{new Date(set.timestamp).toLocaleString()}</Text>
        </div>
        {set.changes.map(edit => <Text key={edit.field}>{edit.field} changed from "{edit.oldValue}" {"->"} "{edit.newValue}"</Text>)}
    </>
}

function RelationUpdatedContent({set}: {set: RelationUpdateSet}) {
    console.log(JSON.stringify(set.changes));
    // kinda gave up on supporting different entity types halfway through this since realistically only tags are referenced in the near futures
    const tags = useTagStore(store => store.tags);

    const nameLookup: Record<TodoRelatedEntityType, [string, string]> = {
        "TAG": ["Tag", "Tags"]
    };

    const typeLookup: Record<TodoRelationUpdateType, string> = {"LINKED": "Added", "UNLINKED": "Removed"}

    return <>
        <div>
            <Text fz="xl" mb="0">Modified {set.changes.length} {nameLookup[set.changes[0].relatedEntityType][Number(!!--set.changes.length)]} </Text>
            <Text c="dimmed">{new Date(set.timestamp).toLocaleString()}</Text>
        </div>
        {set.changes.map(change => {
            let tag = tags.filter(t => t.id == change.relatedEntityId)[0]
            if (tag === undefined) tag = {id: -1, title: "(deleted)", color: "#999999", description: ""};
            return <Fragment key={change.relatedEntityId}>
                {typeLookup[change.updateType]} <TagBadge tag={tag} />
            </Fragment>
        })}
    </>
}