import { EMPTY, merge, Observable, zip } from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  takeUntil
} from "rxjs/operators";

export enum RequestState {
  inProgress = "inProgress", // Request is processing
  success = "success", // Request finished and succeeds
  error = "error" // Request finished and failed
}

export enum RequestType {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete"
}

export interface Request<P = void> {
  type: RequestType | string;
  state: RequestState;
  payload: P;
  error?: Error;
}
export const feedback = <State, Query>(
  query: (s: State) => Query | undefined,
  effect: (q: Query) => Observable<PayloadAction>
) => (state$: Observable<State>) =>
  state$.pipe(
    map<State, Query | undefined>(query),
    distinctUntilChanged(),
    switchMap(q => (q === undefined ? EMPTY : effect(q)))
  );

export const feedbackSet = <State, Query, P>(
  query: (s: State) => Query[], // State => Set<Query>
  effect: (q: Query) => Observable<PayloadAction<P>> // Query => Observable<Action>
) => (state$: Observable<State>) => {
  // Observable<State> => Observable<Action>
  const queries = state$.pipe(
    map(s => new Set(query(s))),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  const diff = (curr: Set<Query>, prev: Set<Query>) =>
    new Set([...curr].filter(c => !prev.has(c)));

  const newQueries = zip(
    queries,
    queries.pipe(startWith(new Set<Query>()))
  ).pipe(map(([current, previous]) => diff(current, previous)));

  return newQueries.pipe(
    mergeMap((controls: Set<Query>) =>
      merge(
        ...[...controls].map(control =>
          effect(control).pipe(
            takeUntil(queries.pipe(filter(q => !q.has(control))))
          )
        )
      )
    )
  );
};
