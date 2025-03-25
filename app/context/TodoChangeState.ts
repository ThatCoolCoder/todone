import { create } from 'zustand';
import { TodoChange } from '~/data/TodoChange';

import db from '~/services/database';
import { addItem, removeItem, updateItem } from '~/services/misc';

interface TodoChangeState {
    changes: TodoChange[],
    add: (t: TodoChange) => void,
    update: (t: TodoChange) => void,
    remove: (t: TodoChange) => void,
}

export const useTodoChangeStore = create<TodoChangeState>()(set => ({
    changes: [],
    add: (t) => set(state => {
        db.changes.add(t);
        return {
            changes: addItem(state.changes, t)
        }
    }),
    update: (t) => set(state => {
        db.changes.update(t);
        return {
            changes: updateItem(state.changes, t)
        }
    }),
    remove: (t) => set(state => {
        db.changes.delete(t.id);
        return {
            changes: removeItem(state.changes, t)
        }
    })
}))