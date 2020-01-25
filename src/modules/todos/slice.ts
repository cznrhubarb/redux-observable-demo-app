import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ApiStatus } from "@modules/common";
import { TodoItem, TodoData } from "./models";

export type TodoState = {
  loadingStatus: ApiStatus;
  addingStatus: ApiStatus;
  todoToAdd?: TodoData;
  todos: TodoItem[];
};

export const initialState: TodoState = {
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  todos: []
};

// State is wrapped with immer produce so it can be mutated but the end result will be immutable
const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    loadTodos(state: TodoState) {
      state.loadingStatus = ApiStatus.LOADING;
    },

    loadTodosDone(state: TodoState, action: PayloadAction<TodoItem[]>) {
      state.loadingStatus = ApiStatus.LOADED;
      state.todos = action.payload;
    },

    loadTodosError(state: TodoState) {
      state.loadingStatus = ApiStatus.FAILED;
    },

    addTodo(state: TodoState, action: PayloadAction<TodoData>) {
      state.addingStatus = ApiStatus.LOADING;
      state.todoToAdd = action.payload;
    },

    addTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
      state.addingStatus = ApiStatus.LOADED;
      state.todos.push(action.payload);
      delete state.todoToAdd;
    },

    addTodoError(state: TodoState) {
      state.loadingStatus = ApiStatus.FAILED;
    },

    toggleTodo(state: TodoState, action: PayloadAction<TodoItem>) {
      const todo: TodoItem | undefined = state.todos.find(
        t => t.id === action.payload.id
      );
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  }
});

export const { reducer, actions } = slice;
