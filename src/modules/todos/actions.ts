import { createAction } from "@reduxjs/toolkit";

import { TodoItem } from "./models";

export enum ActionTypes {
  LOAD_TODOS = "todos/load",
  LOADING_TODOS = "todos/loading",
  LOADED_TODOS = "todos/loaded",
  LOADING_TODOS_FAILED = "todos/loading_failed",

  ADD_TODO = "todos/add",
  ADDING_TODO = "todos/adding",
  ADDED_TODOS = "todos/added",
  ADDING_TODOS_FAILED = "todos/adding_failed"
}

export const actions = {
  loadTodos: createAction(ActionTypes.LOAD_TODOS)
};

export const loadTodos = createAction(ActionTypes.LOAD_TODOS);

export const loadedTodos = createAction<{ todos: TodoItem[] }>(
  ActionTypes.LOADED_TODOS
);

export const loadingTodosFailed = createAction(
  ActionTypes.LOADING_TODOS_FAILED
);

export const addTodo = createAction<{ text: string }>(ActionTypes.ADD_TODO);

export const addingTodo = createAction(ActionTypes.ADDING_TODO);

export const addedTodo = createAction<{ todo: TodoItem }>(
  ActionTypes.ADDED_TODOS
);

export const addingTodoFailed = createAction(ActionTypes.ADDING_TODOS_FAILED);
