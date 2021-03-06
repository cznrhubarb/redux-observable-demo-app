import { catchError, map, retry } from "rxjs/operators";
import { of } from "rxjs";
import { ajax, ajaxGet } from "rxjs/internal-compatibility";

import { TodoItem } from "@modules/todos/models";
import {
  RequestState as RS,
  RequestType as RT,
  Request,
  matchRequest,
} from "@modules/common/requests";
import { feedbackFlag, feedbackArray } from "@modules/common/operators";
import { StateEpic, combineStateEpics } from "@modules/common/epics";

import { actions, TodoState } from "./slice";

const loadTodosEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackFlag(
      s => matchRequest(RT.read, RS.inProgress)(s.loadingRequest),
      () =>
        ajaxGet("http://localhost:5000/todos").pipe(
          retry(3),
          map(response => actions.loadTodosDone(response.response)),
          catchError(() => of(actions.loadTodosError()))
        )
    )
  );

const updateTodoEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(s => s.todos),
    feedbackArray<TodoState, Request<TodoItem>>(
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

const addTodoEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(s => s.todos),
    feedbackArray<TodoState, Request<TodoItem>>(
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

const removeTodoEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(s => s.todos),
    feedbackArray<TodoState, Request<TodoItem>>(
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

export default combineStateEpics(
  loadTodosEpic,
  updateTodoEpic,
  addTodoEpic,
  removeTodoEpic
);
