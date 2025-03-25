// Simple little "library" for a table-based database.
// It is designed to work with localStorage or similar for persistence and has an interface similar to interacting with a rest API.
// Not very efficient as it hits save/load for every transaction instead of keeping stuff in memory but it's fine for an app of this size.
// To use, create a context type (used as TCtx) which contains some Tables (this is where the actual data is stored when its loaded).
// Then create a TableMeta for each table, psssing it a function to get table, load context, save context, a reference to a db-wide action manager,
// and optionally overrides (see below)

// There is also the option to run an override for add/update/delete operations.
// These allow adding extra functionality (eg change tracking), and by returning true/false they can determine whether the operation should continue or be skipped

import { ActionManager } from "./actionManager";

interface IHasId {
    id: number
}

export class Table<TItem extends IHasId> {
    items: TItem[] = []
    nextId: number = 1
}

export interface DbOverrides<TItem> {
    onAdd?: (a: TItem) => boolean | void,
    onUpdate?: (old: TItem, curr: TItem) => boolean | void, // old/curr values n stuff will only work if you use it immutably
    onDelete?: (a: TItem) => boolean | void,
}

type Action = {
    action: () => any,
    onComplete: (value: unknown) => void,
    name: string,
}

export class TableMeta<TItem extends IHasId, TCtx> {
    constructor(
        getTable: (a: TCtx) => Table<TItem>,
        loadCtx: () => TCtx,
        saveCtx: (a: TCtx) => void,
        actionManager: ActionManager,
        overrides: DbOverrides<TItem> = {},
        ) {
        this.getTable = getTable;
        this.loadCtx = loadCtx;
        this.saveCtx = saveCtx;
        this.actionManager = actionManager;
        this.overrides = overrides;
    }
    getTable;
    loadCtx;
    saveCtx;
    overrides;
    actionManager;

    currentAction: Action | null = null;
    pendingActions: Action[] = [];

    public async getAll(): Promise<TItem[]> {
        return await this.actionManager.queue(() => {
            let data = this.getTable(this.loadCtx())
                .items;
            this.actionManager.onFinished();
            return data;
        }, "getAll") as TItem[];
    }

    public async get(id: number): Promise<TItem | null> {
        return await this.actionManager.queue(() => {
            let data = this.getTable(this.loadCtx())
                .items
                .filter(x => x.id == id)[0] || null;
            this.actionManager.onFinished();
            return data;
        }, "get") as TItem | null;
    }

    public async add(item: TItem): Promise<boolean> {
        return await this.actionManager.queue(() => {
            
            const ctx = this.loadCtx();
            const table = this.getTable(ctx);
            
            item.id = table.nextId;
            if (this.shouldSkipOperation(this.overrides.onAdd, item)) return false;
            table.items.push(item);
            table.nextId ++;

            this.saveCtx(ctx);
            this.actionManager.onFinished();
            return true;
        }, "add") as boolean;
    }

    public async update(item: TItem): Promise<boolean> {
        return await this.actionManager.queue(() => {
            const ctx = this.loadCtx();
            const table = this.getTable(ctx);
            
            let index = table.items.findIndex(i => i.id == item.id);
            if (index == -1) return false;

            if (this.shouldSkipOperation(this.overrides.onUpdate, table.items[index], item)) return false;

            table.items[index] = item;

            this.saveCtx(ctx);
            this.actionManager.onFinished();
            return true;
        }, "update") as boolean;
    }

    public async delete(id: number): Promise<boolean> {
        return await this.actionManager.queue(() => {
            const ctx = this.loadCtx();
            const table = this.getTable(ctx);
            
            let index = table.items.findIndex(i => i.id == id);
            if (index == -1) return false;

            if (this.shouldSkipOperation(this.overrides.onDelete, table.items[index])) return false;

            table.items.splice(index, 1);

            this.saveCtx(ctx);
            this.actionManager.onFinished();
            return true;
        }, "delete") as boolean;
    }

    shouldSkipOperation(overrideFunc: ((...args: any[]) => boolean | void) | undefined, ...args: any[]) {
        if (! overrideFunc) return false; // if no override then it always goes
        let result = overrideFunc(...args);
        if (result === undefined) return false; // if no value was returned then is ok
        else return !result; // otherwise actually use the result
    }
}