import { combineEpics, Epic, StateObservable } from "redux-observable";
import { catchError, map, retry } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ajax, ajaxGet } from "rxjs/internal-compatibility";

import { TodoItem } from "@modules/todos/models";
import {
  RequestState as RS,
  RequestType as RT,
  Request,
  matchRequest,
} from "@modules/common/requests";
import { feedback, feedbackSet } from "@modules/common/operators";

import { actions, TodoState } from "./slice";

const loadTodosEpic: Epic = (_, state$: StateObservable<AppState>) =>
  state$.pipe(
    map(state => state.todos),
    feedback(
      s => matchRequest(RT.read, RS.inProgress)(s.loadingRequest),
      () =>
        ajaxGet("http://localhost:5000/todos").pipe(
          retry(3),
          map(response => actions.loadTodosDone(response.response)),
          catchError(() => of(actions.loadTodosError()))
        )
    )
  );

const updateTodoEpic: Epic = (_, state$: StateObservable<AppState>) =>
  state$.pipe(
    map(s => s.todos),
    feedbackSet<
      TodoState,
      Request<TodoItem>,
      TodoItem | { item: TodoItem; error: Error }
    >(
      s => s.todoRequests.filter(matchRequest(RT.update, RS.inProgress)),
      request =>
        ajax({
          url: `http://localhost:5000/todos/${request.payload.id}`,
          method: "PUT",
          body: request.payload, // Move update somewhere else
          headers: {
            "Content-Type": "application/json",
          },
        }).pipe(
          retry(3),
          map(() => actions.updateTodoDone(request.payload)),
          catchError(e =>
            of(
              actions.updateTodoError({
                item: request.payload,
                error: e,
              })
            )
          )
        )
    )
  );

const addTodoEpic: Epic = (_, state$: Observable<AppState>) =>
  state$.pipe(
    map(s => s.todos),
    feedbackSet<TodoState, Request<TodoItem>, TodoItem>(
      s => s.todoRequests.filter(matchRequest(RT.create, RS.inProgress)),
      request =>
        ajax({
          url: "http://localhost:5000/todos",
          method: "POST",
          body: request.payload,
          headers: {
            "Content-Type": "application/json",
          },
        }).pipe(
          map(r => actions.addTodoDone(r.response)),
          catchError(() => of(actions.addTodoError(request.payload)))
        )
    )
  );

const removeTodoEpic: Epic = (_, state$: Observable<AppState>) =>
  state$.pipe(
    map(s => s.todos),
    feedbackSet<
      TodoState,
      Request<TodoItem>,
      TodoItem | { item: TodoItem; error: Error }
    >(
      s => s.todoRequests.filter(matchRequest(RT.delete, RS.inProgress)),
      request =>
        ajax({
          url: `http://localhost:5000/todos/${request.payload.id}`,
          method: "DELETE",
        }).pipe(
          map(() => actions.removeTodoDone(request.payload)),
          catchError(e =>
            of(
              actions.removeTodoError({
                item: request.payload,
                error: e,
              })
            )
          )
        )
    )
  );

export default combineEpics(
  loadTodosEpic,
  updateTodoEpic,
  addTodoEpic,
  removeTodoEpic
);
