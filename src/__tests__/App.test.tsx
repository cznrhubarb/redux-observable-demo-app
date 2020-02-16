import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { createStore } from "@store/index";

import App from "../App";

describe("App", () => {
  const store = createStore();

  it("mounts without crashing", () => {
    mount(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});
