import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { CircularProgress, Typography, WithStyles } from "@material-ui/core";
import { ITodoItem, ApiStatus } from "../models";
import { loadTodos } from "../actions/todosActions";

const useStyles = makeStyles((theme: Theme) => ({
  wrap: {
    display: "flex",
    justifyContent: "center"
  },
  content: {
    width: 500
  },
  addButton: {
    marginTop: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
}));

const App: React.FC<AppProps> = props => {
  const [desc, setDesc] = useState("");
  const todos = useSelector(state => state.todos.todos);
  const loadingStatus = useSelector(state => state.todos.loadingStatus);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTodos());
  }, []);

  const addNewTodo = () => {
    dispatch(addTodo(desc));
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
            todos.map(todo => <Paper key={todo.id}>{todo.description}</Paper>)}
        </div>
      </div>
    </div>
  );
};

export default App;

type AppProps = WithStyles<typeof styles>;
