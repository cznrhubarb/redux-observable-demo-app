import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import MUDivider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import { CircularProgress, Typography } from "@material-ui/core";

import styled from "styled-components";

import {
  actions as todoActions,
  TodoState,
  TodoItem,
  TodoList,
  TodoData,
} from "@modules/todos";
import {
  RequestType,
  RequestState,
  getRequest,
  isMatching,
} from "@modules/common/request";
import { AppState } from "@store/index";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 500px;
`;

const AddButton = styled(Button)`
  margin-top: 10px;
`;

const Divider = styled(MUDivider)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const App: React.FC = () => {
  const [desc, setDesc] = useState("");
  const textRef = useRef<HTMLInputElement>();
  const todosState = useSelector<AppState, TodoState>(state => state.todos);
  const { todos } = todosState;
  const todosRequest = getRequest(todosState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(todoActions.loadTodos());
  }, [dispatch]);

  const addNewTodo = () => {
    dispatch(todoActions.addTodo({ text: desc }));
    setDesc("");
    return textRef.current?.focus();
  };

  const deleteTodo = (item: TodoItem) => {
    dispatch(todoActions.removeTodo({ item }));
  };

  const deleteTodoCancel = (item: TodoItem) => {
    dispatch(todoActions.removeTodoCancel({ item }));
  };

  const updateTodo = (item: TodoItem, data: Partial<TodoData>) => {
    dispatch(todoActions.updateTodo({ item, data }));
  };

  const onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  console.log(todosRequest);

  return (
    <Wrap>
      <Content>
        <div>
          <TextField
            multiline
            autoFocus
            inputRef={textRef}
            placeholder="Enter todo message"
            rows="5"
            variant="outlined"
            onChange={onDescChange}
            value={desc}
            fullWidth
          />
          <AddButton
            disabled={!desc}
            color="primary"
            variant="contained"
            onClick={addNewTodo}
            fullWidth
          >
            Add Todo
          </AddButton>
        </div>

        <Divider />

        <div>
          {isMatching(
            todosRequest,
            RequestState.inProgress,
            RequestType.read
          ) && <CircularProgress />}

          {isMatching(todosRequest, RequestState.error, RequestType.read) && (
            <Typography color="error">Failed to load todos</Typography>
          )}

          {isMatching(todosRequest, RequestState.success, RequestType.read) && (
            <TodoList
              items={todos}
              onItemUpdate={updateTodo}
              onItemDelete={deleteTodo}
              onItemDeleteCancel={deleteTodoCancel}
            />
          )}
        </div>
      </Content>
    </Wrap>
  );
};

export default App;
