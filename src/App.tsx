import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import MUDivider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import { CircularProgress, Typography } from "@material-ui/core";

import styled, { ThemeProvider } from "styled-components";

import {
  actions as todoActions,
  TodoItem,
  TodoList,
  TodoState,
} from "@modules/todos";

import {
  RequestState as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";

const theme = {
  color: {
    black: "#000",
  },
  layout: {
    width: 500,
  },
  spacing: 10,
};

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  color: ${props => props.theme.color.black};
`;

const Content = styled.div`
  width: ${props => props.theme.layout.width}px;
`;

const AddButton = styled(Button)`
  margin-top: ${props => props.theme.spacing}px;
`;

const Divider = styled(MUDivider)`
  margin-top: ${props => props.theme.spacing}px;
  margin-bottom: ${props => props.theme.spacing}px;
`;

const App: React.FC = () => {
  const [desc, setDesc] = useState("");
  const textRef = useRef<HTMLInputElement>();
  const todosState = useSelector<AppState, TodoState>(state => state.todos);
  const { entities, loading } = todosState;
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(todoActions.loadTodos());
  }, [dispatch]);

  const addNewTodo = () => {
    dispatch(todoActions.addTodo({ text: desc }));
    setDesc("");
    return textRef.current?.focus();
  };

  const deleteTodo = (item: TodoItem) => {
    dispatch(todoActions.removeTodo(item));
  };

  const updateTodo = (item: TodoItem) => {
    dispatch(todoActions.updateTodo(item));
  };

  const onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  const onReset = () => {
    dispatch(todoActions.reset());
  };

  const onCancel = () => {
    dispatch(todoActions.loadTodosCancel());
  };

  return (
    <ThemeProvider theme={theme}>
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
            {matchRequest(RT.read, RS.inProgress)(loading) && (
              <Wrap>
                <CircularProgress />
              </Wrap>
            )}

            {matchRequest(RT.read, RS.error)(loading) && (
              <Typography color="error">Failed to load todos</Typography>
            )}

            {matchRequest(RT.read, RS.success)(loading) && (
              <>
                <TodoList
                  items={entities}
                  onItemUpdate={updateTodo}
                  onItemDelete={deleteTodo}
                />
              </>
            )}

            <Wrap>
              {matchRequest(RT.read, RS.inProgress)(loading) ? (
                <Button onClick={onCancel} color="secondary">
                  Cancel
                </Button>
              ) : (
                <Button onClick={onReset} color="primary">
                  Reload
                </Button>
              )}
            </Wrap>
          </div>
        </Content>
      </Wrap>
    </ThemeProvider>
  );
};

export default App;
