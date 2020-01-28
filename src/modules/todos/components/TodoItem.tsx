import React, { memo } from "react";

import {
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";

import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import CancelOutlined from "@material-ui/icons/CancelOutlined";
import RepeatRounded from "@material-ui/icons/RepeatRounded";

import { Request, RequestState, RequestType } from "../slice";

export interface Props {
  text: string;
  checked?: boolean;
  divider?: boolean;
  onDeleteButtonClick?: () => void;
  onCancelButtonClick?: () => void;
  onCheckBoxToggle?: () => void;
  request?: Request;
}

const TodoListItem: React.FC<Props> = memo(props => {
  const {
    text,
    checked,
    divider,
    onDeleteButtonClick,
    onCancelButtonClick,
    onCheckBoxToggle,
    request
  } = props;

  return (
    <ListItem divider={divider}>
      <Checkbox onClick={onCheckBoxToggle} checked={checked} disableRipple />

      <ListItemText
        primary={text}
        secondary={request && `Request ${request.type} ${request.state}`}
      />

      {!request?.state || request?.state === RequestState.success ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={onDeleteButtonClick}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {request &&
      request.type === RequestType.delete &&
      [RequestState.error, RequestState.canceled].includes(request.state) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Retry Todo" onClick={onDeleteButtonClick}>
            <RepeatRounded />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {request &&
      request.type === RequestType.delete &&
      [RequestState.initial, RequestState.in_progress].includes(
        request.state
      ) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Cancel" onClick={onCancelButtonClick}>
            <CancelOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
});

export default TodoListItem;
