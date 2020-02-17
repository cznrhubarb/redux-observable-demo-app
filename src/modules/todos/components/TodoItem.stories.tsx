import React from "react";
import { action } from "@storybook/addon-actions";
import { withKnobs, select } from "@storybook/addon-knobs";

import { TodoItem as TodoModel } from "@modules/todos/models";
import { Request, RequestType, RequestState } from "@modules/common/requests";

import { List } from "@material-ui/core";

import TodoItem from "./TodoItem";

export default {
  title: "TodoItem",
  component: TodoItem,
  decorators: [withKnobs],
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
      text="Hello World Todo Item"
      request={request}
    />
  </List>
);

export const withEmoji = () => (
  <List>
    <TodoItem text="😀 😎 👍 💯" request={request} />
  </List>
);

export const withRequest = () => {
  const typeSelectKnob = select(
    "Request Type",
    {
      Create: RequestType.create,
      Delete: RequestType.delete,
      Read: RequestType.read,
      Update: RequestType.update,
    },
    RequestType.create
  );

  const stateSelectKnob = select(
    "Request State",
    {
      InProgress: RequestState.inProgress,
      Success: RequestState.success,
      Error: RequestState.error,
    },
    RequestState.inProgress
  );

  return (
    <List>
      <TodoItem
        onCheckBoxToggle={action("checked")}
        text="Hello World Todo Item"
        request={{
          ...request,
          type: typeSelectKnob,
          state: stateSelectKnob,
        }}
      />
    </List>
  );
};
