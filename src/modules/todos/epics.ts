import { combineEpics, Epic } from "redux-observable";
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter,
  mergeMap
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { from, of } from "rxjs";

import { TypeFromCreator } from "../../tsHelpers";

import * as TodoActionCreator from "./actions";
import { TodosActionTypes } from "./actionTypes";

type TodoActions = TypeFromCreator<typeof TodoActionCreator>;

const loadTodosEpic: Epic<TodoActions, TodoActions, void> = action$ =>
  action$.pipe(
    filter(action => action.type === TodosActionTypes.LOAD_TODOS),
    switchMap(() =>
      from(ajax({ url: "http://localhost:5000/todos", method: "GET" })).pipe(
        map(response => TodoActionCreator.loadedTodos(response.response)),
        startWith(TodoActionCreator.loadingTodos()),
        catchError(() => of(TodoActionCreator.loadingTodosFailed()))
      )
    )
  );

const addTodoEpic: Epic<TodoActions, TodoActions, void> = action$ =>
  action$.pipe(
    filter(action => action.type === TodosActionTypes.ADD_TODO),
    mergeMap(() =>
      from(
        ajax({
          url: "http://localhost:5000/todos",
          method: "POST"
          // body: action.payload
        })
      ).pipe(
        map(response => TodoActionCreator.addedTodo(response.response)),
        startWith(TodoActionCreator.addingTodo()),
        catchError(() => of(TodoActionCreator.addingTodoFailed()))
      )
    )
  );

export default combineEpics(loadTodosEpic, addTodoEpic);
