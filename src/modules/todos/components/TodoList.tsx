import React, { memo } from "react";
import { List, Paper } from "@material-ui/core";

import TodoListItem from "./TodoItem";
import { TodoItemState } from "../slice";
import { TodoData } from "../models";

export interface Props {
  items: TodoItemState[];
  onItemDelete: (item: TodoItemState) => void;
  onItemDeleteCancel: (item: TodoItemState) => void;
  onItemUpdate: (item: TodoItemState, data: Partial<TodoData>) => void;
}

const TodoList: React.FC<Props> = memo(props => (
  <>
    {props.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List style={{ overflow: "scroll" }}>
          {props.items.map((todo, idx) => (
            <TodoListItem
              key={`TodoItem.${todo.id}`}
              text={todo.text}
              request={todo.request}
              checked={Boolean(todo.completed)}
              divider={idx !== props.items.length - 1}
              onDeleteButtonClick={() => props.onItemDelete(todo)}
              onCancelButtonClick={() => props.onItemDeleteCancel(todo)}
              onCheckBoxToggle={() =>
                props.onItemUpdate(todo, { completed: !todo.completed })
              }
            />
          ))}
        </List>
      </Paper>
    )}
  </>
));

export default TodoList;
