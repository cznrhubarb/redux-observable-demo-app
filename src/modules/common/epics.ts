import { Epic, combineEpics, StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { Action } from "redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateEpic<State, Output extends Action<unknown> = any> = (
  state$: StateObservable<State>
) => Observable<Output>;

export const stateEpicToEpic = <State, Output extends Action<unknown>>(
  stateEpic: StateEpic<State, Output>
): Epic<Action<unknown>, Output, State> => (_, $state) => stateEpic($state);

export const combineStateEpics = <State, Output extends Action<unknown>>(
  ...stateEpics: StateEpic<State, Output>[]
) => combineEpics(...stateEpics.map(stateEpicToEpic));
