import { produce } from "immer";

import { ApiStatus } from "../common";
import { TypeFromCreator } from "../../tsHelpers";

import { TodoItem } from "./models";
import * as TodoActionCreator from "./actions";

const { ActionTypes } = TodoActionCreator;

export type TodoState = {
  loadingStatus: ApiStatus;
  addingStatus: ApiStatus;
  todos: TodoItem[];
};

export const initialState: TodoState = {
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  todos: []
};

type TodoActionTypes = TypeFromCreator<any>;

export default function todosReducer(
  state: TodoState = initialState,
  action: TodoActionTypes
) {
  return produce(state, draft => {
    switch (action.type) {
      case ActionTypes.LOAD_TODOS:
      case ActionTypes.LOADING_TODOS:
        draft.loadingStatus = ApiStatus.LOADING;
        break;

      case ActionTypes.LOADING_TODOS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED;
        break;

      case ActionTypes.LOADED_TODOS:
        draft.loadingStatus = ApiStatus.LOADED;
        draft.todos = action.payload.todos;
        break;

      case ActionTypes.ADD_TODO:
      case ActionTypes.ADDING_TODO:
        draft.addingStatus = ApiStatus.LOADING;
        break;

      case ActionTypes.ADDING_TODOS_FAILED:
        draft.addingStatus = ApiStatus.FAILED;
        break;

      case ActionTypes.ADDED_TODOS:
        draft.todos.push(action.payload.todo);
        break;

      default:
    }
  });
}
