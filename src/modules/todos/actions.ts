import { TodosActionTypes } from "./actionTypes";
import { TodoItem } from "./models";

export function loadTodos() {
  return {
    type: TodosActionTypes.LOAD_TODOS
  } as const;
}

export function loadingTodos() {
  return {
    type: TodosActionTypes.LOADING_TODOS
  } as const;
}

export function loadedTodos(todos: TodoItem[]) {
  return {
    type: TodosActionTypes.LOADED_TODOS,
    payload: {
      todos
    }
  } as const;
}

export function loadingTodosFailed() {
  return {
    type: TodosActionTypes.LOADING_TODOS_FAILED
  } as const;
}

export function addTodo(description: string) {
  return {
    type: TodosActionTypes.ADD_TODO,
    payload: {
      description
    }
  } as const;
}

export function addingTodo() {
  return {
    type: TodosActionTypes.ADDING_TODO
  } as const;
}

export function addedTodo(todo: TodoItem) {
  return {
    type: TodosActionTypes.ADDED_TODOS,
    payload: {
      todo
    }
  } as const;
}

export function addingTodoFailed() {
  return {
    type: TodosActionTypes.ADDING_TODOS_FAILED
  } as const;
}
