import { catchError, map, retry } from "rxjs/operators";
import { of } from "rxjs";
import { ajax, ajaxGet } from "rxjs/internal-compatibility";

import { TodoStateItem } from "@modules/todos/models";
import {
  RequestState as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";
import { feedbackFlag, feedbackArray } from "@modules/common/operators";
import { StateEpic, combineStateEpics } from "@modules/common/epics";

import { actions, TodoState } from "./slice";

const loadTodosEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackFlag(
      state => matchRequest(RT.read, RS.inProgress)(state.loading),
      () =>
        ajaxGet("http://localhost:5000/todos").pipe(
          retry(3),
          map(request => actions.loadTodosDone(request.response)),
          catchError(() => of(actions.loadTodosError()))
        )
    )
  );

const updateTodoEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        state.entities.filter(entity =>
          matchRequest(RT.update, RS.inProgress)(entity.request)
        ),
      entity =>
        ajax({
          url: `http://localhost:5000/todos/${entity.data.id}`,
          method: "PUT",
          body: entity.data, // Move update somewhere else
          headers: {
            "Content-Type": "application/json",
          },
        }).pipe(
          retry(3),
          map(() => actions.updateTodoDone(entity.request.payload)),
          catchError(error => of(actions.updateTodoError(entity, error)))
        )
    )
  );

const addTodoEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        state.entities.filter(entity =>
          matchRequest(RT.create, RS.inProgress)(entity.request)
        ),
      entity =>
        ajax({
          url: "http://localhost:5000/todos",
          method: "POST",
          body: entity.data,
          headers: {
            "Content-Type": "application/json",
          },
        }).pipe(
          map(() => actions.addTodoDone(entity.request.payload)),
          catchError(error => of(actions.addTodoError(entity.data, error)))
        )
    )
  );

const removeTodoEpic: StateEpic<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        state.entities.filter(entity =>
          matchRequest(RT.delete, RS.inProgress)(entity.request)
        ),
      entity =>
        ajax({
          url: `http://localhost:5000/todos/${entity.data.id}`,
          method: "DELETE",
        }).pipe(
          map(() => actions.removeTodoDone(entity.data)),
          catchError(error => of(actions.removeTodoError(entity.data, error)))
        )
    )
  );

export default combineStateEpics(
  loadTodosEpic,
  updateTodoEpic,
  addTodoEpic,
  removeTodoEpic
);
