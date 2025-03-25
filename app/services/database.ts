import { Todo } from "~/data/Todo";
import { IDbEntity, Table, TableMeta } from "./databaseLibrary";
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
            cascadingDelete(db.changes, todo, c => c.todoId);
            cascadingDelete(db.tagTodos, todo, t => t.todoId);
        }
    }),
    // for these three we could optionally choose to validate the relations on create/update but that is pointless for this app and would just be slow
    changes: new TableMeta<TodoChange, TodoneContext>(c => c.changes, load, save, actionManager),
    tags: new TableMeta<Tag, TodoneContext>(c => c.tags, load, save, actionManager, {
        onDelete: tag => {
            cascadingDelete(db.tagTodos, tag, t => t.tagId);
        }
    }),
    tagTodos: new TableMeta<TagTodo, TodoneContext>(c => c.tagTodos, load, save, actionManager),
}

export default db;

function cascadingDelete<TParent extends IDbEntity, TChild extends IDbEntity>(
        childTable: TableMeta<TChild, TodoneContext>, parent: TParent, getParentId: (c: TChild) => number) {

    childTable.getAll().then(children => {
        children
            .filter(c => getParentId(c) == parent.id)
            .forEach(c => childTable.delete(c.id));
    })
}