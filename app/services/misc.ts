export function groupBy<T>(data: T[], groupFunc: (a: T) => string) {
    let result: Record<string, T[]> = {};
    for (let item of data) {
        let key = groupFunc(item);
        if (key in result) result[key].push(item);
        else result[key] = [item];
    }
    
    return Object.keys(result)
        .map(k => ( {key: k, items: result[k]} ));
}

export function addItem<T>(data: T[], item: T) {
    return data.concat([item]);
}

export function updateItem<T extends {id: number}>(data: T[], item: T) {
    const clone = [...data];
    clone.splice(clone.findIndex(t => t.id == item.id), 1, item);
    return clone;
}

export function removeItem<T extends {id: number}>(data: T[], item: T) {
    const clone = [...data];
    clone.splice(clone.findIndex(t => t.id == item.id), 1);
    return clone;
}