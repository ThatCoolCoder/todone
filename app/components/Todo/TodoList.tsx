import { Grid, Text } from "@mantine/core";
import { useContext } from "react";
import { TodosContext } from "~/context/TodosContext";
import TodoCard from "./TodoCard";

export default function TodoList({hideDone}: {hideDone: boolean}) {
    const allTodos = useContext(TodosContext);

    const displayedTodos = hideDone ? allTodos.val.filter(t => ! t.done) : allTodos.val;

    return<>
        <Grid>
            {allTodos.val.map(todo => 
                <Grid.Col key={todo.id}><TodoCard todo={todo} /></Grid.Col>
            )}
        </Grid>
        <br />
        {displayedTodos.length == 0 && <Text fz="large">No todos yet</Text>}
    </>
}