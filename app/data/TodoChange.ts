export interface TodoChange {
    id: number,
    todoId: number,
    type: TodoEditType
}

export type TodoEditType = "CREATED" | "EDITED";

export interface TodoCreated extends TodoChange {
    // no extra data
}

export interface TodoEdited extends TodoChange {
    field: string,
    oldValue: string,
}