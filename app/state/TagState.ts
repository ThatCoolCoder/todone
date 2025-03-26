import { create } from 'zustand';

import { Tag } from '~/data/Tag';
import { TagTodo } from '~/data/TagTodo';
import db from '~/services/database';
import { addItem, removeItem, updateItem } from '~/services/misc';

interface TagState {
    tags: Tag[],
    tagTodos: TagTodo[],
    init: (tags: Tag[], tagTodos: TagTodo[]) => void,
    add: (t: Tag) => void,
    update: (t: Tag) => void,
    remove: (t: Tag) => void,
}

export const useTagStore = create<TagState>()(set => ({
    tags: [],
    tagTodos: [],
    init: (tags, tagTodos) => set(() => {
        return {tags, tagTodos}
    }),
    add: (t) => set(state => {
        db.tags.add(t);
        return {
            tags: addItem(state.tags, t)
        }
    }),
    update: (t) => set(state => {
        db.tags.update(t);
        return {
            tags: updateItem(state.tags, t)
        }
    }),
    remove: (t) => set(state => {
        db.tags.delete(t.id);
        return {
            tags: removeItem(state.tags, t)
        }
    })
}))

export function setInitialTags(init: (tags: Tag[], tagTodos: TagTodo[]) => void) {
    Promise.all([db.tags.getAll(), db.tagTodos.getAll()]).then(values => {
        init(values[0], values[1]);
    })
}