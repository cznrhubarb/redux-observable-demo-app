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

import {
  isMatching,
  Request,
  RequestState,
  RequestType,
} from "@modules/common/request";

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
      {isMatching(
        request,
        [RequestState.initial, RequestState.inProgress],
        RequestType.update
      ) ? (
        <CircularProgress size={42} color="secondary" />
      ) : (
        <Checkbox onClick={onCheckBoxToggle} checked={checked} />
      )}

      <ListItemText
        primary={text}
        secondary={request && `Request ${request.type} ${request.state}`}
      />

      {!isMatching(request, [], RequestType.delete) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={onDeleteButtonClick}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {isMatching(
        request,
        [RequestState.error, RequestState.canceled],
        RequestType.delete
      ) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Retry Todo" onClick={onDeleteButtonClick}>
            <RepeatRounded />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {isMatching(request, RequestState.initial, RequestType.delete) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Cancel" onClick={onCancelButtonClick}>
            <CancelOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {isMatching(request, RequestState.inProgress, RequestType.delete) ? (
        <ListItemSecondaryAction>
          <CircularProgress size={42} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

export default memo(TodoListItem);
