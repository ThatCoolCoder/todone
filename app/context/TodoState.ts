import { create } from 'zustand';

import { Todo } from '~/data/Todo';
import db from '~/services/database';
import { addItem, removeItem, updateItem } from '~/services/misc';

interface TodoState {
    todos: Todo[],
    init: (todos: Todo[]) => void,
    add: (t: Todo) => void,
    update: (t: Todo) => void,
    remove: (t: Todo) => void,
}

export const useTodoStore = create<TodoState>()(set => ({
    todos: [],
    init: (todos) => set(() => {
        return {todos: todos}
    }),
    add: (t) => set(state => {
        db.todos.add(t);
        return {
            todos: addItem(state.todos, t)
        }
    }),
    update: (t) => set(state => {
        db.todos.update(t);
        return {
            todos: updateItem(state.todos, t)
        }
    }),
    remove: (t) => set(state => {
        db.todos.delete(t.id);
        return {
            todos: removeItem(state.todos, t)
        }
    })
}))

export function setInitialTodos(init: (todos: Todo[]) => void) {
    db.todos.getAll().then(t => init(t));
}