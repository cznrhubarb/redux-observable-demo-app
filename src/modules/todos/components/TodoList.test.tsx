import { shallow } from "enzyme";
import React from "react";

import { Request, createRequest } from "@modules/common/requests";

import TodoList from "./TodoList";
import TodoItemComponent from "./TodoItem";
import { TodoItem } from "../models";

describe("TodoList", () => {
  const onItemDelete = jest.fn();
  const onItemUpdate = jest.fn();

  const items: Request<TodoItem>[] = [
    createRequest({ id: 1, text: "Todo 1", completed: false }),
    createRequest({ id: 2, text: "Todo 2", completed: false }),
    createRequest({ id: 3, text: "Todo 3", completed: false }),
  ];

  const todoList = shallow(
    <TodoList
      items={items}
      onItemDelete={onItemDelete}
      onItemUpdate={onItemUpdate}
    />
  );

  it("renders 3 todos", () => {
    expect(todoList.find(TodoItemComponent)).toHaveLength(3);
  });

  it("matches snapshot", () => {
    expect(todoList).toMatchSnapshot();
  });
});
