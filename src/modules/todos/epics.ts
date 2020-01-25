import { combineEpics, Epic } from "redux-observable";
import {
  switchMap,
  map,
  // startWith,
  catchError,
  filter,
  mergeMap
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { from, of } from "rxjs";

// import { TypeFromCreator } from "../../tsHelpers";

import { actions } from "./slice";
import { todoFactory } from "./models";

type TodoActions = typeof actions;

const loadTodosEpic: Epic<any, any, void> = action$ =>
  action$.pipe(
    filter(actions.loadTodos.match),
    switchMap(() =>
      from(ajax({ url: "http://localhost:5000/todos", method: "GET" })).pipe(
        map(response => actions.loadTodosDone(response.response)),
        catchError(() => of(actions.loadTodosError()))
      )
    )
  );

const addTodoEpic: Epic<any, any, void> = action$ =>
  action$.pipe(
    filter(actions.addTodo.match),
    mergeMap(action =>
      from(
        ajax({
          url: "http://localhost:5000/todos",
          method: "POST",
          body: todoFactory(action.payload)
        })
      ).pipe(
        map(response => actions.addTodoDone(response.response)),
        catchError(() => of(actions.addTodoError()))
      )
    )
  );

export default combineEpics(loadTodosEpic, addTodoEpic);
