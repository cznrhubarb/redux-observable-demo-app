import { combineEpics, Epic } from "redux-observable";
import {
  switchMap,
  map,
  catchError,
  filter,
  mergeMap,
  startWith,
  takeUntil,
  switchMapTo,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { from, of, timer } from "rxjs";

import { actions } from "./slice";
import { createTodo } from "./models";

const DELAY_TIME = 3000;

const loadTodosEpic: Epic = action$ =>
  action$.pipe(
    filter(actions.loadTodos.match),
    switchMap(() =>
      from(ajax({ url: "http://localhost:5000/todos", method: "GET" })).pipe(
        map(response => actions.loadTodosDone(response.response)),
        startWith(actions.loadTodosInProgress()),
        catchError((error: Error) => of(actions.loadTodosError({ error })))
      )
    )
  );

const addTodoEpic: Epic = action$ =>
  action$.pipe(
    filter(actions.addTodo.match),
    mergeMap(action =>
      from(
        ajax({
          url: "http://localhost:5000/todos",
          method: "POST",
          body: createTodo(action.payload),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).pipe(
        map(response => actions.addTodoDone(response.response)),
        startWith(actions.addTodoInProgress(action.payload)),
        catchError((error: Error) =>
          of(actions.addTodoError({ ...action.payload, error }))
        )
      )
    )
  );

const removeTodoEpic: Epic = action$ =>
  action$.pipe(
    filter(actions.removeTodo.match),
    switchMap(action =>
      from(timer(DELAY_TIME)).pipe(
        switchMapTo(
          from(
            ajax({
              url: `http://localhost:5000/todos/${action.payload.item.id}`,
              method: "DELETE",
            })
          ).pipe(
            map(() => actions.removeTodoDone(action.payload)),
            startWith(actions.removeTodoInProgress(action.payload)),
            catchError((error: Error) =>
              of(actions.removeTodoError({ ...action.payload, error }))
            )
          )
        ),
        takeUntil(
          action$.pipe(
            filter(actions.removeTodoCancel.match),
            filter(
              cancelAction =>
                action.payload.item.id === cancelAction.payload.item.id
            )
          )
        )
      )
    )
  );

const updateTodoEpic: Epic = action$ =>
  action$.pipe(
    filter(actions.updateTodo.match),
    mergeMap(action =>
      from(
        ajax({
          url: `http://localhost:5000/todos/${action.payload.item.id}`,
          method: "PUT",
          body: { ...action.payload.item, ...action.payload.data },
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).pipe(
        map(() => actions.updateTodoDone(action.payload)),
        startWith(actions.updateTodoInProgress(action.payload)),
        catchError((error: Error) =>
          of(actions.updateTodoError({ ...action.payload, error }))
        )
      )
    )
  );

export default combineEpics(
  loadTodosEpic,
  addTodoEpic,
  removeTodoEpic,
  updateTodoEpic
);
