import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  RequestState,
  RequestType,
  Request,
  createRequest,
  updateRequest,
} from "@modules/common/requests";
import { TodoItem, TodoData, createTodo } from "./models";

export interface TodoState {
  loadingRequest: Request;
  todoRequests: Request<TodoItem>[];
}

export const initialState: TodoState = {
  loadingRequest: createRequest(
    undefined,
    RequestType.read,
    RequestState.inProgress
  ),
  todoRequests: [],
};

// State is wrapped with immer produce so it can be mutated but the end result will be immutable
const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    loadTodos(state: TodoState) {
      state.loadingRequest = updateRequest(
        state.loadingRequest,
        RequestState.inProgress,
        RequestType.read
      );
    },

    loadTodosDone(
      state: TodoState,
      action: PayloadAction<TodoItem[]>
    ) {
      state.loadingRequest = updateRequest(
        state.loadingRequest,
        RequestState.success,
        RequestType.read
      );
      state.todoRequests = action.payload.map(todo =>
        createRequest(todo, RequestType.read, RequestState.success)
      );
    },

    loadTodosError(state: TodoState) {
      state.loadingRequest = updateRequest(
        state.loadingRequest,
        RequestState.error,
        RequestType.read
      );
    },

    addTodo(state: TodoState, action: PayloadAction<TodoData>) {
      state.todoRequests.push(
        createRequest(createTodo(action.payload))
      );
    },

    addTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(
              request,
              RequestState.success,
              RequestType.create
            )
          : request
      );
    },

    addTodoError(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(
              request,
              RequestState.error,
              RequestType.create
            )
          : request
      );
    },

    removeTodo(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(
              request,
              RequestState.inProgress,
              RequestType.delete
            )
          : request
      );
    },

    removeTodoDone(
      state: TodoState,
      action: PayloadAction<TodoItem>
    ) {
      state.todoRequests = state.todoRequests.filter(
        request => request.payload.id !== action.payload.id
      );
    },

    removeTodoError(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; error: Error }>
    ) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.item.id
          ? updateRequest(
              request,
              RequestState.error,
              RequestType.delete,
              action.payload.error.message
            )
          : request
      );
    },

    updateTodo(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(
              request,
              RequestState.inProgress,
              RequestType.update
            )
          : request
      );
    },

    updateTodoDone(
      state: TodoState,
      action: PayloadAction<TodoItem>
    ) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(
              { ...request, payload: action.payload },
              RequestState.success,
              RequestType.update
            )
          : request
      );
    },

    updateTodoError(
      state: TodoState,
      action: PayloadAction<{ item: TodoItem; error: Error }>
    ) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.item.id
          ? updateRequest(
              request,
              RequestState.error,
              RequestType.update,
              action.payload.error.message
            )
          : request
      );
    },

    reset() {
      return initialState;
    },
  },
});

export const { reducer, actions } = slice;
