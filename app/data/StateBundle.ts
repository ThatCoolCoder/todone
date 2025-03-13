import type { StateSetter } from "./StateSetter";

export type StateBundle<T> = {
    val: T,
    set: StateSetter<T>
};

export function makeStateBundle<T>(val: T, set: StateSetter<T>) {
    return {val, set};
}