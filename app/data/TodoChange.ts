export interface TodoChange {
    id: number,
    todoId: number,
    type: TodoChangeType,
    timestamp: number
}

export type TodoChangeType = "CREATED" | "EDITED";

export interface TodoCreated extends TodoChange {
    // no extra data
}

export interface TodoEdited extends TodoChange {
    field: string,
    oldValue: string,
    newValue: string,
}