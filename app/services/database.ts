import { Todo } from "~/data/Todo";
import { Table, TableMeta } from "./databaseLibrary";
import { TodoChange, TodoEdited } from "~/data/TodoChange";
import { ActionManager } from "./actionManager";
import { Tag } from "~/data/Tag";
import { TagTodo } from "~/data/TagTodo";

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
    tags = new Table<Tag>();
    tagTodos = new Table<TagTodo>();
}

const actionManager = new ActionManager();

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
                    oldValue: String(old[field]),
                    newValue: String(curr[field])
                };
                db.changes.add(change);
            }
        },
        onDelete: todo => {
            // cascading delete
            db.changes.getAll().then(changes => {
                changes
                    .filter(c => c.todoId == todo.id)
                    .forEach(c => db.changes.delete(c.id));
            })
        }
    }),
    changes: new TableMeta<TodoChange, TodoneContext>(c => c.changes, load, save, actionManager),
    tags: new TableMeta<Tag, TodoneContext>(c => c.tags, load, save, actionManager),
    tagTodos: new TableMeta<TagTodo, TodoneContext>(c => c.tagTodos, load, save, actionManager),
}

export default db;