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

    addLink: (tagId: number, todoId: number) => void,
    removeLink: (tagId: number, todoId: number) => void,
}

export const useTagStore = create<TagState>()(set => ({
    tags: [],
    tagTodos: [],
    init: (tags, tagTodos) => set(() => {
        return {tags, tagTodos}
    }),

    add: (t) => set(state => {
        db.tags.add(t);
        return { tags: addItem(state.tags, t) }
    }),
    update: (t) => set(state => {
        db.tags.update(t);
        return { tags: updateItem(state.tags, t) }
    }),
    remove: (t) => set(state => {
        db.tags.delete(t.id);
        return { tags: removeItem(state.tags, t) }
    }),

    addLink: (tagId, todoId) => set(state => {
        const tt = {id: -1, tagId, todoId};
        db.tagTodos.add(tt);
        return { tagTodos: addItem(state.tagTodos, tt) }
    }),
    removeLink: (tagId, todoId) => set(state => {
        const tt = state.tagTodos.filter(tt => tt.tagId == tagId && tt.todoId == todoId)[0];
        if (tt === undefined) throw new Error("No matching tag");
        db.tagTodos.delete(tt.id);
        return { tagTodos: removeItem(state.tagTodos, tt) }
    })
}))

export function setInitialTags(init: (tags: Tag[], tagTodos: TagTodo[]) => void) {
    Promise.all([db.tags.getAll(), db.tagTodos.getAll()]).then(values => {
        init(values[0], values[1]);
    })
}