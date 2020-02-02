import uuidv4 from "uuid/v4";

import { Item } from "@modules/common/models";

export interface TodoData {
  text: string;
  completed?: boolean;
}

export interface TodoItem extends TodoData, Item {}

export function createTodo(data: TodoData): TodoItem {
  return {
    id: uuidv4(),
    completed: data.completed ?? false,
    text: data.text,
  };
}
