import { combineReducers, applyMiddleware, createStore } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  // TodoState,
  epics as todosEpics,
  reducer as todosReducer,
  initialState as todosInitialState
} from "./modules/todos";

export interface AppState {
  todos: any;
}

export const initialState: AppState = {
  todos: todosInitialState
};

const combinedReducers = combineReducers({
  todos: todosReducer
});

const epicMiddleware = createEpicMiddleware();
const rootEpic = combineEpics(todosEpics);

const logger = createLogger();

const store = createStore(
  combinedReducers,
  composeWithDevTools(applyMiddleware(...[epicMiddleware, logger]))
);

epicMiddleware.run(rootEpic);

export default store;
