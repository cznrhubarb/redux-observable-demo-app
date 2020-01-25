export interface TodoData {
  text: string;
}

export interface TodoItem extends TodoData {
  id: number;
  completed: boolean;
}

export function todoFactory(data: TodoData): TodoItem {
  return {
    id: Math.random(),
    completed: false,
    text: data.text
  };
}
