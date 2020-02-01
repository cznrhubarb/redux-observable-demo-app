import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import { CircularProgress, Typography } from "@material-ui/core";

import {
  actions as todoActions,
  TodoState,
  TodoItem,
  TodoList,
  TodoData,
} from "@modules/todos";
import { RequestState } from "@modules/common/request";
import { AppState } from "@store/index";

const useStyles = makeStyles((theme: Theme) => ({
  wrap: {
    display: "flex",
    justifyContent: "center",
  },
  content: {
    width: 500,
  },
  addButton: {
    marginTop: theme.spacing(),
  },
  divider: {
    marginTop: theme.spacing() * 2,
    marginBottom: theme.spacing() * 2,
  },
}));

const App: React.FC = () => {
  const [desc, setDesc] = useState("");
  const textRef = useRef<HTMLInputElement>();
  const todosState = useSelector<AppState, TodoState>(state => state.todos);
  const { todos, loadingStatus } = todosState;
  const classes = useStyles();
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

  return (
    <div className={classes.wrap}>
      <div className={classes.content}>
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
          <Button
            disabled={!desc}
            className={classes.addButton}
            color="primary"
            variant="contained"
            onClick={addNewTodo}
            fullWidth
          >
            Add Todo
          </Button>
        </div>

        <Divider className={classes.divider} />

        <div>
          {loadingStatus === RequestState.in_progress && <CircularProgress />}

          {loadingStatus === RequestState.error && (
            <Typography color="error">Failed to load todos</Typography>
          )}

          {loadingStatus === RequestState.success && (
            <TodoList
              items={todos}
              onItemUpdate={updateTodo}
              onItemDelete={deleteTodo}
              onItemDeleteCancel={deleteTodoCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
