import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  WithRequest,
  ItemWithRequest,
  RequestType,
  RequestState,
  setRequest,
  updateRequest,
  setRequestOnListItem,
  updateRequestOnListItem,
} from "@modules/common/request";
import { TodoItem, TodoData } from "./models";

export type TodoItemState = TodoItem & ItemWithRequest<TodoData>;

export type TodoState = WithRequest<TodoData> & {
  todos: TodoItemState[];
};

export const initialState: TodoState = {
  todos: [],
};

// State is wrapped with immer produce so it can be mutated but the end result will be immutable
const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    loadTodos(state: TodoState) {
      setRequest(state, {
        type: RequestType.read,
        state: RequestState.initial,
      });
    },

    loadTodosInProgress(state: TodoState) {
      updateRequest(state, {
        type: RequestType.read,
        state: RequestState.inProgress,
      });
    },

    loadTodosDone(state: TodoState, action: PayloadAction<TodoItem[]>) {
      updateRequest(state, {
        type: RequestType.read,
        state: RequestState.success,
      });

      state.todos = action.payload;
    },

    loadTodosError(state: TodoState, action: PayloadAction<{ error: Error }>) {
      updateRequest(state, {
        error: action.payload.error,
        type: RequestType.read,
        state: RequestState.error,
      });
    },

    addTodo(state: TodoState, action: PayloadAction<TodoData>) {
      setRequest(state, {
        type: RequestType.create,
        state: RequestState.initial,
        payload: action.payload,
      });
    },

    addTodoInProgress(state: TodoState) {
      updateRequest(state, {
        type: RequestType.create,
        state: RequestState.inProgress,
      });
    },

    addTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
      updateRequest(state, {
        type: RequestType.create,
        state: RequestState.success,
      });

      state.todos.push(action.payload);
    },

    addTodoError(state: TodoState, action: PayloadAction<{ error: Error }>) {
      updateRequest(state, {
        error: action.payload.error,
        type: RequestType.create,
        state: RequestState.error,
      });
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
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.delete,
          state: RequestState.inProgress,
        }
      );
    },

    removeTodoCancel(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem }>
    ) {
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.delete,
          state: RequestState.canceled,
        }
      );
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
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.delete,
          state: RequestState.error,
          error: action.payload.error,
        }
      );
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
        payload: action.payload.data,
      });
    },

    updateTodoInProgress(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.update,
          state: RequestState.inProgress,
        }
      );
    },

    updateTodoCancel(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.update,
          state: RequestState.canceled,
        }
      );
    },

    updateTodoDone(
      state: TodoState,
      action: PayloadAction<{
        item: TodoItem;
        data: Partial<TodoData>;
      }>
    ) {
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.update,
          state: RequestState.success,
        }
      );

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
      state.todos = updateRequestOnListItem(
        state.todos,
        action.payload.item.id,
        {
          type: RequestType.update,
          state: RequestState.error,
          error: action.payload.error,
        }
      );
    },
  },
});

export const { reducer, actions } = slice;
