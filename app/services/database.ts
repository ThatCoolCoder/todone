import { Todo } from "~/data/Todo";
import { Table, TableMeta } from "./persistenceServices";
import { TodoChange } from "~/data/TodoChange";

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

const db = {
    todos: new TableMeta<Todo, TodoneContext>(c => c.todos, load, save),
    changes: new TableMeta<TodoChange, TodoneContext>(c => c.changes, load, save),
}

export default db;