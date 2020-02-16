import { shallow } from "enzyme";
import React from "react";

import { Request } from "@modules/common/requests";
import TodoList from "../../components/TodoList";
import { TodoItem } from "../../models";

describe("TodoList", () => {
  const onItemDelete = jest.fn();
  const onItemUpdate = jest.fn();
  const items: Request<TodoItem>[] = [];

  it("Renders TodoList with 5 todos", () => {
    const link = shallow(
      <TodoList
        items={items}
        onItemDelete={onItemDelete}
        onItemUpdate={onItemUpdate}
      />
    );
    expect(link).toMatchSnapshot();
  });
});
