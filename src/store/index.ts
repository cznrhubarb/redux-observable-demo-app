import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";

import {
  epics as todosEpics,
  reducer as todosReducer,
  initialState as todosInitialState,
} from "@modules/todos";

const reducer = combineReducers({
  todos: todosReducer,
});

type CombinedState = ReturnType<typeof reducer>;

// App store declared globally so it can be referenced anywhere
// without cycle imports
declare global {
  export type AppState = CombinedState;
}

export const initialState: AppState = {
  todos: todosInitialState,
};

export function createStore() {
  const logger = createLogger();
  const epicMiddleware = createEpicMiddleware();
  const rootEpic = combineEpics(todosEpics);

  const middleware = [...getDefaultMiddleware(), epicMiddleware, logger];

  const store = configureStore({
    reducer,
    middleware,
  });

  epicMiddleware.run(rootEpic);

  return store;
}
