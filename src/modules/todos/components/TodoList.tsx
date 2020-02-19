import React, { memo } from "react";
import { List, Paper } from "@material-ui/core";

import TodoListItem from "./TodoItem";
import { TodoItem, TodoStateItem } from "../models";

export interface Props {
  items: TodoStateItem[];
  onItemDelete: (item: TodoItem) => void;
  onItemUpdate: (item: TodoItem) => void;
}

const TodoList: React.FC<Props> = memo(props => (
  <>
    {props.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List style={{ overflow: "scroll" }}>
          {props.items.map((todo, idx) => (
            <TodoListItem
              key={`TodoItem.${todo.data.id}`}
              item={todo}
              divider={idx !== props.items.length - 1}
              onDeleteButtonClick={() => props.onItemDelete(todo.data)}
              onCheckBoxToggle={() =>
                props.onItemUpdate({
                  ...todo.data,
                  completed: !todo.data.completed,
                })
              }
            />
          ))}
        </List>
      </Paper>
    )}
  </>
));

export default TodoList;
