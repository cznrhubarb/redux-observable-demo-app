import { combineEpics, Epic, StateObservable } from "redux-observable";
import { catchError, map, retry } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ajax, ajaxGet } from "rxjs/internal-compatibility";
import { AppState } from "@store/index";
import { TodoItem } from "@modules/todos/models";
import {
  feedback,
  feedbackSet,
  RequestState,
  RequestType,
  Request
} from "@modules/common";
import { actions, TodoState } from "./slice";

const loadTodosEpic: Epic = (_, state$: StateObservable<AppState>) =>
  state$.pipe(
    map(state => state.todos),
    feedback(
      s => (s.loadingRequest === RequestState.in_progress ? {} : undefined),
      _ =>
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
    feedbackSet<TodoState, Request<TodoItem>, TodoItem>(
      s =>
        new Set(
          s.todoRequests.filter(
            r =>
              r.state === RequestState.in_progress &&
              r.type === RequestType.update
          )
        ),
      request =>
        ajax({
          url: `http://localhost:5000/todos/${request.payload.id}`,
          method: "PUT",
          body: request.payload, // Move update somewhere else
          headers: {
            "Content-Type": "application/json"
          }
        }).pipe(
          retry(3),
          map(_ => actions.updateTodoDone(request.payload))
        )
    )
  );

const addTodoEpic: Epic = (_, state$: Observable<AppState>) =>
  state$.pipe(
    map(s => s.todos),
    feedbackSet<TodoState, Request<TodoItem>, TodoItem>(
      s =>
        new Set(
          s.todoRequests.filter(
            r =>
              r.type === RequestType.create &&
              r.state === RequestState.in_progress
          )
        ),
      request =>
        ajax({
          url: "http://localhost:5000/todos",
          method: "POST",
          body: request.payload,
          headers: {
            "Content-Type": "application/json"
          }
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
      s =>
        new Set(
          s.todoRequests.filter(
            r =>
              r.type === RequestType.delete &&
              r.state === RequestState.in_progress
          )
        ),
      request =>
        ajax({
          url: `http://localhost:5000/todos/${request.payload.id}`,
          method: "DELETE"
        }).pipe(
          map(_ => actions.removeTodoDone(request.payload)),
          catchError(e =>
            of(actions.removeTodoError({ item: request.payload, error: e }))
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
