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
  takeUntil,
} from "rxjs/operators";

export const feedback = <State, Query>(
  query: (s: State) => Query | undefined,
  effect: (q: Query) => Observable<PayloadAction>
) => (state$: Observable<State>) =>
  state$.pipe(
    map<State, Query | undefined>(query),
    distinctUntilChanged(),
    switchMap(q => (q === undefined ? EMPTY : effect(q)))
  );

export const feedbackFlag = <State, Query extends boolean>(
  query: (s: State) => Query,
  effect: () => Observable<PayloadAction>
) => (state$: Observable<State>) =>
  state$.pipe(
    map<State, Query>(query),
    distinctUntilChanged(),
    switchMap(q => (q ? effect() : EMPTY))
  );

export const feedbackSet = <State, Query>(
  query: (s: State) => Set<Query>, // State => Set<Query>
  effect: (q: Query) => Observable<PayloadAction<any>> // Query => Observable<Action>
) => (state$: Observable<State>) => {
  // Observable<State> => Observable<Action>
  const queries = state$.pipe(
    map(query),
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

export const feedbackArray = <State, Query, P = unknown>(
  query: (s: State) => Query[],
  effect: (q: Query) => Observable<PayloadAction<P>> // Query => Observable<Action>
) => (state$: Observable<State>) => {
  // Observable<State> => Observable<Action>
  const queries = state$.pipe(
    map(query),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  const diff = (curr: Query[], prev: Query[]) =>
    [...curr].filter(c => !prev.includes(c));

  const newQueries = zip(queries, queries.pipe(startWith([] as Query[]))).pipe(
    map(([current, previous]) => diff(current, previous))
  );

  return newQueries.pipe(
    mergeMap((controls: Query[]) =>
      merge(
        ...[...controls].map(control =>
          effect(control).pipe(
            takeUntil(queries.pipe(filter(q => !q.includes(control))))
          )
        )
      )
    )
  );
};
