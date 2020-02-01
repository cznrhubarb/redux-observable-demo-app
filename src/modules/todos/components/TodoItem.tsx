import React, { memo } from "react";

import {
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@material-ui/core";

import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import CancelOutlined from "@material-ui/icons/CancelOutlined";
import RepeatRounded from "@material-ui/icons/RepeatRounded";

import { Request, RequestState, RequestType } from "@modules/common/request";

export interface Props {
  text: string;
  checked?: boolean;
  divider?: boolean;
  onDeleteButtonClick?: () => void;
  onCancelButtonClick?: () => void;
  onCheckBoxToggle?: () => void;
  request?: Request;
}

const TodoListItem: React.FC<Props> = props => {
  const {
    text,
    checked,
    divider,
    onDeleteButtonClick,
    onCancelButtonClick,
    onCheckBoxToggle,
    request,
  } = props;

  return (
    <ListItem divider={divider}>
      {request &&
      request.type === RequestType.update &&
      [RequestState.initial, RequestState.in_progress].includes(
        request.state
      ) ? (
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
      [RequestState.error, RequestState.canceled].includes(request.state) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Retry Todo" onClick={onDeleteButtonClick}>
            <RepeatRounded />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {request?.type === RequestType.delete &&
      request?.state === RequestState.initial ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Cancel" onClick={onCancelButtonClick}>
            <CancelOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {request?.type === RequestType.delete &&
      request?.state === RequestState.in_progress ? (
        <ListItemSecondaryAction>
          <CircularProgress size={42} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default memo(TodoListItem);
