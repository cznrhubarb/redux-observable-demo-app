import { produce } from "immer";

import { ApiStatus } from "../common";
import { TypeFromCreator } from "../../tsHelpers";

import { TodoItem } from "./models";
import * as TodoActionCreator from "./actions";
import { TodosActionTypes } from "./actionTypes";

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

type TodoActionTypes = TypeFromCreator<typeof TodoActionCreator>;

export default function todosReducer(
  state: TodoState = initialState,
  action: TodoActionTypes
) {
  return produce(state, draft => {
    switch (action.type) {
      case TodosActionTypes.LOAD_TODOS:
      case TodosActionTypes.LOADING_TODOS:
        draft.loadingStatus = ApiStatus.LOADING;
        break;

      case TodosActionTypes.LOADING_TODOS_FAILED:
        draft.loadingStatus = ApiStatus.FAILED;
        break;

      case TodosActionTypes.LOADED_TODOS:
        draft.loadingStatus = ApiStatus.LOADED;
        draft.todos = action.payload.todos;
        break;

      case TodosActionTypes.ADD_TODO:
      case TodosActionTypes.ADDING_TODO:
        draft.addingStatus = ApiStatus.LOADING;
        break;

      case TodosActionTypes.ADDING_TODOS_FAILED:
        draft.addingStatus = ApiStatus.FAILED;
        break;

      case TodosActionTypes.ADDED_TODOS:
        draft.todos.push(action.payload.todo);
        break;

      default:
    }
  });
}
