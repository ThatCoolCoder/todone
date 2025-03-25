import { create } from 'zustand';
import { TodoChange } from '~/data/TodoChange';

import db from '~/services/database';
import { addItem, removeItem, updateItem } from '~/services/misc';

interface TodoChangeState {
    changes: TodoChange[],
    init: (c: TodoChange[]) => void
    add: (c: TodoChange) => void,
    update: (c: TodoChange) => void,
    remove: (c: TodoChange) => void,
}

export const useTodoChangeStore = create<TodoChangeState>()(set => ({
    changes: [],
    init: (c) => set(() => {
        return {changes: c}
    }),
    add: (c) => set(state => {
        db.changes.add(c);
        return {
            changes: addItem(state.changes, c)
        }
    }),
    update: (c) => set(state => {
        db.changes.update(c);
        return {
            changes: updateItem(state.changes, c)
        }
    }),
    remove: (c) => set(state => {
        db.changes.delete(c.id);
        return {
            changes: removeItem(state.changes, c)
        }
    })
}))

export function setInitialChanges(init: (changes: TodoChange[]) => void) {
    db.changes.getAll().then(changes => init(changes));
}