import React, { memo } from "react";
import { List, Paper } from "@material-ui/core";

import { Request } from "@modules/common/requests";
import TodoListItem from "./TodoItem";
import { TodoItem } from "../models";

export interface Props {
  items: Request<TodoItem>[];
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
              key={`TodoItem.${todo.payload.id}`}
              text={todo.payload.text}
              request={todo}
              checked={Boolean(todo.payload.completed)}
              divider={idx !== props.items.length - 1}
              onDeleteButtonClick={() => props.onItemDelete(todo.payload)}
              onCheckBoxToggle={() =>
                props.onItemUpdate({
                  ...todo.payload,
                  completed: !todo.payload.completed,
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
