interface IHasId {
    id: number
}

export class Table<TItem extends IHasId> {
    items: TItem[] = []
    nextId: number = 1
}

export class TableMeta<TItem extends IHasId, TCtx> {
    constructor(
        getTable: (a: TCtx) => Table<TItem>,
        loadCtx: () => TCtx,
        saveCtx: (a: TCtx) => void
        ) {
        this.getTable = getTable;
        this.loadCtx = loadCtx;
        this.saveCtx = saveCtx;
    }
    getTable;
    loadCtx;
    saveCtx;

    public getAll(): TItem[] {
        return this.getTable(this.loadCtx())
            .items;
    }

    public get(id: number): TItem | null {
        return this.getTable(this.loadCtx())
            .items
            .filter(x => x.id == id)[0] || null;
    }

    public add(item: TItem) {
        const ctx = this.loadCtx();
        const table = this.getTable(ctx);

        item.id = table.nextId;
        table.items.push(item);
        table.nextId ++;

        this.saveCtx(ctx);
    }

    public update(item: TItem): boolean {
        const ctx = this.loadCtx();
        const table = this.getTable(ctx);

        let index = table.items.findIndex(i => i.id == item.id);
        if (index == -1) return false;

        table.items[index] = item;

        this.saveCtx(ctx);
        return true;
    }

    public delete(id: number): boolean {
        const ctx = this.loadCtx();
        const table = this.getTable(ctx);

        let index = table.items.findIndex(i => i.id == id);
        if (index == -1) return false;

        table.items.splice(index, 1);

        this.saveCtx(ctx);
        return true;

    }
}