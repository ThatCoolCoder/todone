import { Todo } from "~/data/Todo";
import { Table, TableMeta } from "./persistenceServices";
import { TodoChange, TodoEdited } from "~/data/TodoChange";
import { ActionManager } from "./actionManager";

const localStorageKey = "todoneContext2";

function load() {
    if (! (localStorageKey in localStorage)) return new TodoneContext();
    return JSON.parse(localStorage[localStorageKey]) as TodoneContext;
}

function save(ctx: TodoneContext) {
    localStorage[localStorageKey] = JSON.stringify(ctx);
}

class TodoneContext {
    todos = new Table<Todo>();
    changes = new Table<TodoChange>();
}

const actionManager = new ActionManager(false);

const db = {
    todos: new TableMeta<Todo, TodoneContext>(c => c.todos, load, save, actionManager, {
        onAdd: todo => {
            db.changes.add({
                id: -1,
                todoId: todo.id,
                type: "CREATED",
                timestamp: Date.now()
            });
        },
        onUpdate: (old, curr) => {
            const fields: (keyof Todo)[] = ["title", "body", "done"];
            let timestamp = Date.now();
            for (let field of fields) {
                if (old[field] == curr[field]) continue;

                let change: TodoEdited = {
                    id: -1,
                    todoId: old.id,
                    type: "EDITED",
                    timestamp: timestamp,
                    field: field,
                    oldValue: JSON.stringify(old[field]),
                    newValue: JSON.stringify(curr[field])
                };
                db.changes.add(change);
            }
        }
    }),
    changes: new TableMeta<TodoChange, TodoneContext>(c => c.changes, load, save, actionManager),
}

export default db;