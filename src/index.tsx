import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { createStore } from "@store/index";
import App from "./App";

// Look into store.scubsrcibe
const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
