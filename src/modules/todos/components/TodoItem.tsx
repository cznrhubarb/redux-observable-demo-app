import React, { memo } from "react";

import {
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress
} from "@material-ui/core";

import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import RepeatRounded from "@material-ui/icons/RepeatRounded";

import { Request, RequestState, RequestType } from "@modules/common";
import { TodoItem } from "../models";

export interface Props {
  text: string;
  checked?: boolean;
  divider?: boolean;
  onDeleteButtonClick?: () => void;
  onCheckBoxToggle?: () => void;
  request: Request<TodoItem>;
}

const TodoListItem: React.FC<Props> = memo(props => {
  const {
    text,
    checked,
    divider,
    onDeleteButtonClick,
    onCheckBoxToggle,
    request
  } = props;

  return (
    <ListItem divider={divider}>
      {request &&
      request.type === RequestType.update &&
      request.state === RequestState.inProgress ? (
        <CircularProgress size={42} color="secondary" />
      ) : (
        <Checkbox onClick={onCheckBoxToggle} checked={checked} />
      )}

      <ListItemText
        primary={text}
        secondary={request && `Request ${request.type} ${request.state}`}
      />

      {!request?.state || request.type !== RequestType.delete ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={onDeleteButtonClick}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {request &&
      request.type === RequestType.delete &&
      request.state === RequestState.error ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Retry Todo" onClick={onDeleteButtonClick}>
            <RepeatRounded />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {request?.type === RequestType.delete &&
      request?.state === RequestState.inProgress ? (
        <ListItemSecondaryAction>
          <CircularProgress size={42} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
});

export default TodoListItem;
