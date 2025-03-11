import { useState, useEffect, ReactNode } from "react";
import db from "~/services/database";
import { TodoChange } from "~/data/TodoChange";
import { ChangesContext } from "~/context/ChangesContext";

export default function ChangeSource({todoId, children}: {todoId?: number, children: ReactNode}) {
    const [changes, setChanges] = useState([] as TodoChange[])

    useEffect(() => {
        db.changes.getAll().then(changes => {
            if (todoId !== undefined) changes = changes.filter(c => c.todoId == todoId);
            setChanges(changes);
        });
    }, []);

    return <ChangesContext.Provider value={{val: changes, set: setChanges}}>
        {children}
    </ChangesContext.Provider>
}