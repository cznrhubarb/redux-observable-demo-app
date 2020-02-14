import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RequestState, RequestType, Request } from "@modules/common";
import { TodoItem, TodoData, createTodo } from "./models";

export interface TodoState {
  loadingRequest: RequestState;
  todoRequests: Request<TodoItem>[];
}

export const initialState: TodoState = {
  loadingRequest: RequestState.inProgress,
  todoRequests: []
};

function createRequest<T>(
  todo: T,
  type: RequestType = RequestType.create,
  state: RequestState = RequestState.inProgress
) {
  return {
    type,
    state,
    payload: todo
  };
}

function canUpdate<T>(request: Request<T>, type?: RequestType) {
  return request.state === RequestState.inProgress
    ? request.type === type
    : true;
}

function updateRequest<T>(
  request: Request<T>,
  state?: RequestState,
  type?: RequestType,
  error?: Error
) {
  return canUpdate(request, type)
    ? ({
        ...request,
        state,
        error,
        type
      } as Request<T>)
    : request;
}

// State is wrapped with immer produce so it can be mutated but the end result will be immutable
const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    loadTodos(state: TodoState) {
      state.loadingRequest = RequestState.inProgress;
    },

    loadTodosDone(state: TodoState, action: PayloadAction<TodoItem[]>) {
      state.loadingRequest = RequestState.success;
      state.todoRequests = action.payload.map(todo =>
        createRequest(todo, RequestType.create, RequestState.success)
      );
    },

    loadTodosError(state: TodoState) {
      state.loadingRequest = RequestState.error;
    },

    addTodo(state: TodoState, action: PayloadAction<TodoData>) {
      state.todoRequests.push(createRequest(createTodo(action.payload)));
    },

    addTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(request, RequestState.success, RequestType.create)
          : request
      );
    },

    addTodoError(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(request, RequestState.error, RequestType.create)
          : request
      );
    },

    removeTodo(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(request, RequestState.inProgress, RequestType.delete)
          : request
      );
    },

    removeTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
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
              action.payload.error
            )
          : request
      );
    },

    updateTodo(state: TodoState, action: PayloadAction<TodoItem>) {
      state.todoRequests = state.todoRequests.map(request =>
        request.payload.id === action.payload.id
          ? updateRequest(
              { ...request, payload: action.payload },
              RequestState.inProgress,
              RequestType.update
            )
          : request
      );
    },

    updateTodoDone(state: TodoState, action: PayloadAction<TodoItem>) {
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

    reset() {
      return initialState;
    }
  }
});

export const { reducer, actions } = slice;
