export interface TodoData {
  text: string;
  completed?: boolean;
}

export interface Item {
  id: number;
}

export interface TodoItem extends TodoData, Item {}

export function createTodo(data: TodoData): TodoItem {
  return {
    id: Math.random(),
    completed: data.completed ?? false,
    text: data.text,
  };
}
