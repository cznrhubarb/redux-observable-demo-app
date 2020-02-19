import React, { useState } from "react";
import { action } from "@storybook/addon-actions";

import { TodoItem as TodoModel } from "@modules/todos/models";
import { Request, RequestType, RequestState } from "@modules/common/requests";

import {
  List,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import TodoItem from "./TodoItem";

export default {
  title: "TodoItem",
  component: TodoItem,
};

const request: Request<TodoModel> = {
  type: RequestType.read,
  state: RequestState.success,
  payload: {
    text: "Hello World Todo Item",
    id: 0.23123123123312,
    completed: true,
  },
};

export const withText = () => (
  <List>
    <TodoItem
      onCheckBoxToggle={action("checked")}
      item={{
        data: {
          id: 0.3456,
          text: "Hello World Todo Item",
        },
        request,
      }}
    />
  </List>
);

export const withEmoji = () => (
  <List>
    <TodoItem
      item={{
        data: {
          id: 0.87654321,
          text: "😀 😎 👍 💯",
        },
        request,
      }}
    />
  </List>
);

export const withRequest = () => {
  const [state, setState] = useState(RequestState.inProgress);
  const [type, setType] = useState(RequestType.create);

  const testRequest = {
    ...request,
    state,
    type,
  };

  return (
    <>
      <div style={{ margin: 32 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Request type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={e => setType(e.target.value as RequestType)}
          >
            <MenuItem value={RequestType.create}>Create</MenuItem>
            <MenuItem value={RequestType.delete}>Delete</MenuItem>
            <MenuItem value={RequestType.read}>Read</MenuItem>
            <MenuItem value={RequestType.update}>Update</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ margin: 32 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Request status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={state}
            onChange={e => setState(e.target.value as RequestState)}
          >
            <MenuItem value={RequestState.inProgress}>In Progress</MenuItem>
            <MenuItem value={RequestState.success}>Success</MenuItem>
            <MenuItem value={RequestState.error}>Error</MenuItem>
          </Select>
        </FormControl>
      </div>
      <List>
        <TodoItem
          onCheckBoxToggle={action("checked")}
          item={{
            data: {
              id: 0.98765,
              text: "Hello World Todo Item",
            },
            request: testRequest,
          }}
        />
      </List>
    </>
  );
};
