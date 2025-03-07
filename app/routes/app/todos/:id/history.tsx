import { Card, Checkbox, Grid, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react"
import { Link, RouteProps } from "react-router";
import { Todo } from "~/data/Todo"
import { TodoChange, TodoChangeType, TodoEdited } from "~/data/TodoChange";
import db from "~/services/database";
import { Route } from "../../+types";
import { groupBy } from "~/services/misc";

export default function History(loaderData: Route.ComponentProps) {
    document.title = "History | Todone"

    const [todo, setTodo] = useState(null as Todo | null);
    const [changes, setChanges] = useState(null as TodoChange[] | null)

    useEffect(() => {
        let id = Number(loaderData.params.id)
        db.todos.get(id).then(t => setTodo(t));
        db.changes.getAll().then(changes => {
            let ourChanges = changes.filter(c => c.todoId == id);
            setChanges(ourChanges);
        });
    }, []);

    return <>
        <p className="text-3xl">History for <Link to="/app/"><b>"{todo?.title ?? "---"}"</b></Link></p>
        <br />
        {changes == null ? <>
            Loading change list
        </> : <>
            {changes.length == 0 ? <>
                No Changes
            </> : <>
                <ChangeList changes={changes} />
            </>}
        </>}
    </>
}

type FieldEdit = {
    field: string,
    oldValue: string,
    newValue: string,
}

type FieldEditSet = {
    timestamp: number,
    type: TodoChangeType,
    changes: FieldEdit[]
}

function ChangeList({changes}: {changes: TodoChange[]}) {
    const [mostRecentFirst, setMostRecentFirst] = useState(true);

    const editSets: FieldEditSet[] = 
        groupBy(changes, c => c.timestamp.toString() + "-" + c.type) // group by time
        .map(group => ({
            // convert 
            timestamp: group.items[0].timestamp,
            type: group.items[0].type,
            changes: group.items[0].type == "CREATED"
                ? [] as FieldEdit[] // if created, no fields were changed
                // if edited, 
                : group.items.map(i => ( {
                    field: (i as TodoEdited).field,
                    oldValue: (i as TodoEdited).oldValue,
                    newValue: (i as TodoEdited).newValue,
                } as FieldEdit)
            )}
        ))

    let sorted = editSets.concat([]);
    sorted.sort((a, b) => a.timestamp - b.timestamp);
    if (mostRecentFirst) sorted.reverse();


    return <>
        <Checkbox label="Display most recent first?" checked={mostRecentFirst} onChange={e => setMostRecentFirst(e.target.checked)} />
        <br />
        <Grid>
            {sorted.map(set => <EditSetDetails set={set}/> )}
        </Grid>
    </>
}

function EditSetDetails({set}: {set: FieldEditSet}) {
    return <Grid.Col key={set.timestamp}>
        <Card>
            <Stack>
                <div>
                    <Text fz="xl" mb="0">{set.type == "CREATED" ? "Created" : "Modified"}</Text>
                    <Text c="dimmed">{new Date(set.timestamp).toLocaleString()}</Text>
                </div>
                {set.type == "EDITED" && set.changes.map(edit => <EditDetails key={edit.field} edit={edit}/>)}
            </Stack>
        </Card>
    </Grid.Col>
}

function EditDetails({edit}: {edit: FieldEdit}) {
    return <>
        <Text>{edit.field} changed from "{edit.oldValue}" {"->"} "{edit.newValue}"</Text>
    </>
}