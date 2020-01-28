import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ApiStatus } from "@modules/common";
import { TodoItem, TodoData, Item } from "./models";

export enum RequestState {
  initial = "initial", // Not processed yet
  in_progress = "in_progress", // Request is processing
  success = "success", // Request finished and succeeds
  error = "error", // Request finished and failed
  canceled = "canceled" //  Request canceled by user
}

export enum RequestType {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete"
}

export interface Request<P = void> {
  type: RequestType | string;
  state: RequestState;
  payload?: P;
  error?: Error;
}

interface ItemWithRequest<P = void> extends Item {
  request?: Request<P>;
}

export interface TodoItemState extends TodoItem, ItemWithRequest {}

export interface TodoState {
  loadingStatus: ApiStatus;
  addingStatus: ApiStatus;
  todoToAdd?: TodoData;
  todos: TodoItemState[];
}

export const initialState: TodoState = {
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  todos: []
};

function setRequest<T extends ItemWithRequest>(item: T, request: Request): T {
  return { ...item, request };
}

function setRequestOnListItem<T extends ItemWithRequest>(
  list: T[],
  itemId: T["id"],
  request: Request
): T[] {
  const itemIndex = list.findIndex(i => i.id === itemId);
  if (itemIndex !== -1) {
    return Object.assign([], list, {
      [itemIndex]: setRequest(list[itemIndex], request)
    });
  }

  return list;
}

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

    removeTodo(state: TodoState, action: PayloadAction<{ item: TodoItem }>) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.initial
      });
    },

    removeTodoInProgress(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.in_progress
      });
    },

    removeTodoCancel(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.delete,
        state: RequestState.canceled
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
        error: action.payload.error
      });
    },

    updateTodo(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; data: Partial<TodoData> }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.initial
      });
    },

    updateTodoInProgress(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; data: Partial<TodoData> }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.in_progress
      });
    },

    updateTodoCancel(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; data: Partial<TodoData> }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.canceled
      });
    },

    updateTodoDone(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; data: Partial<TodoData> }>
    ) {
      state.todos = setRequestOnListItem(state.todos, action.payload.item.id, {
        type: RequestType.update,
        state: RequestState.success
      });

      const itemIndex = state.todos.findIndex(
        i => i.id === action.payload.item.id
      );

      if (itemIndex !== -1) {
        state.todos[itemIndex] = {
          ...state.todos[itemIndex],
          ...action.payload.data
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
        error: action.payload.error
      });
    }
  }
});

export const { reducer, actions } = slice;
