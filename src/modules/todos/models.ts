import { Item } from "@modules/common/models";

export interface TodoData {
  text: string;
  completed?: boolean;
}

export interface TodoItem extends TodoData, Item {}

export function createTodo(data: TodoData): TodoItem {
  return {
    id: Math.random(),
    completed: data.completed ?? false,
    text: data.text,
  };
}
