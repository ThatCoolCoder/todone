// Base class with information logged for all types of todo change
export interface TodoChange {
    id: number,
    todoId: number,
    type: TodoChangeType,
    timestamp: number
}

export type TodoChangeType = "CREATED" | "EDITED" | "RELATION_UPDATED";

export interface TodoCreated extends TodoChange {
    // no extra data
}

// When a field of a todo is changed (separate row is created for each changed field)
export interface TodoEdited extends TodoChange {
    field: string,
    oldValue: string,
    newValue: string,
}

export type TodoRelationUpdateType = "LINKED" | "UNLINKED";
export type TodoRelatedEntityType = "TAG";

// When a entity is linked/unlinked to a todo
export interface TodoRelationUpdated extends TodoChange {
    relatedEntityType: TodoRelatedEntityType,
    relatedEntityId: number,
    updateType: TodoRelationUpdateType
}