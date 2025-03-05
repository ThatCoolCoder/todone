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