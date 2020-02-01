import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

import {
  ItemWithRequest,
  RequestType,
  RequestState,
  setRequestOnListItem,
} from "@modules/common/request";
import { TodoItem, TodoData } from "./models";

export interface TodoItemState extends TodoItem, ItemWithRequest {}

export function createRequestSlice(name: string) {
  const actions = [
    name,
    `${name}InProgress`,
    `${name}Done`,
    `${name}Cancel`,
    `${name}Error`,
  ].reduce(
    (slice, actionKey) => ({ ...slice, [actionKey]: createAction(actionKey) }),
    {}
  );

  return actions;
}

export function createRequestAction(name: string) {
  return createAction(`${name}/setRequest`);
}

export interface TodoState {
  loadingStatus: RequestState;
  addingStatus: RequestState;
  todoToAdd?: TodoData;
  todos: TodoItemState[];
}

export const initialState: TodoState = {
  loadingStatus: RequestState.initial,
  addingStatus: RequestState.initial,
  todos: [],
};

// State is wrapped with immer produce so it can be mutated but the end result will be immutable
const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    loadTodos(state: TodoState) {
      state.loadingStatus = RequestState.in_progress;
    },

    loadTodosDone(state: TodoState, action: PayloadAction<TodoItem[]>) {
      state.loadingStatus = RequestState.success;
      state.todos = action.payload;
    },

    loadTodosError(state: TodoState) {
      state.loadingStatus = RequestState.error;
    },

    addTodo(state: TodoState, action: PayloadAction<TodoData>) {
      state.addingStatus = RequestState.in_progress;
      state.todoToAdd = action.payload;
    },

    addTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
      state.addingStatus = RequestState.success;
      state.todos.push(action.payload);
      delete state.todoToAdd;
    },

    addTodoError(state: TodoState) {
      state.loadingStatus = RequestState.error;
    },

    removeTodo(state: TodoState, action: PayloadAction<{ item: TodoItem }>) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.initial,
      });
    },

    removeTodoInProgress(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.in_progress,
      });
    },

    removeTodoCancel(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.canceled,
      });
    },

    removeTodoDone(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem }>
    ) {
      state.todos = state.todos.filter(t => t.id !== action.payload.item.id);
    },

    removeTodoError(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; error: Error }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.error,
        error: action.payload.error,
      });
    },

    updateTodo(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.initial,
      });
    },

    updateTodoInProgress(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.in_progress,
      });
    },

    updateTodoCancel(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.canceled,
      });
    },

    updateTodoDone(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.success,
      });

      const itemIndex = state.todos.findIndex(
        i => i.id === action.payload.item.id
      );

      if (itemIndex !== -1) {
        state.todos[itemIndex] = {
          ...state.todos[itemIndex],
          ...action.payload.data,
        };
      }
    },

    updateTodoError(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
        error: Error;
      }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.error,
        error: action.payload.error,
      });
    },
  },
});

export const { reducer, actions } = slice;
