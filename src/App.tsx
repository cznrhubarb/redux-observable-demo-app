import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { CircularProgress, Typography } from "@material-ui/core";

import { actions as todoActions } from "@modules/todos";
import { AppState } from "./store";
import { TodoState } from "./modules/todos/reducer";
import { ApiStatus } from "./modules/common";

const useStyles = makeStyles((theme: Theme) => ({
  wrap: {
    display: "flex",
    justifyContent: "center"
  },
  content: {
    width: 500
  },
  addButton: {
    marginTop: theme.spacing()
  },
  divider: {
    marginTop: theme.spacing() * 2,
    marginBottom: theme.spacing() * 2
  }
}));

const App: React.FC = () => {
  const [desc, setDesc] = useState("");
  const todosState = useSelector<AppState, TodoState>(state => state.todos);
  const { todos, loadingStatus } = todosState;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(todoActions.loadTodos());
  }, [dispatch]);

  const addNewTodo = () => {
    dispatch(todoActions.addTodo({ text: desc }));
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
            placeholder="Enter todo message"
            rows="5"
            variant="outlined"
            onChange={onDescChange}
            value={desc}
            fullWidth
          />
          <Button
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
          {loadingStatus === ApiStatus.LOADING && <CircularProgress />}

          {loadingStatus === ApiStatus.FAILED && (
            <Typography color="error">Failed to load todos</Typography>
          )}

          {loadingStatus === ApiStatus.LOADED &&
            todos.map(todo => <Paper key={todo.id}>{todo.text}</Paper>)}
        </div>
      </div>
    </div>
  );
};

export default App;
