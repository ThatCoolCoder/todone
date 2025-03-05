import type { StateSetter } from "./StateSetter";

export type StateBundle<T> = {
    val: T,
    set: StateSetter<T>
};