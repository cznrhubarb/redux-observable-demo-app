import React, { memo } from "react";
import styled from "styled-components";
import {
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@material-ui/core";

import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import RepeatRounded from "@material-ui/icons/RepeatRounded";

import {
  Request,
  RequestState as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";
import { TodoItem } from "../models";

export interface Props {
  text: string;
  checked?: boolean;
  divider?: boolean;
  onDeleteButtonClick?: () => void;
  onCheckBoxToggle?: () => void;
  request: Request<TodoItem>;
}

const TodoText = styled(ListItemText)`
  color: ${props => props.theme.color.black};
`;

const TodoListItem: React.FC<Props> = memo(props => {
  const {
    text,
    checked,
    divider,
    onDeleteButtonClick,
    onCheckBoxToggle,
    request,
  } = props;

  return (
    <ListItem divider={divider}>
      {matchRequest(RT.update, RS.inProgress)(request) ? (
        <CircularProgress size={42} color="secondary" />
      ) : (
        <Checkbox onClick={onCheckBoxToggle} checked={checked} />
      )}

      <TodoText
        primary={text}
        secondary={request && `Request ${request.type} ${request.state}`}
      />

      {!matchRequest(RT.delete, [RS.inProgress, RS.error])(request) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={onDeleteButtonClick}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {matchRequest(RT.delete, RS.error)(request) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Retry Todo" onClick={onDeleteButtonClick}>
            <RepeatRounded />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {matchRequest(RT.delete, RS.inProgress)(request) ? (
        <ListItemSecondaryAction>
          <CircularProgress size={42} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
});

export default TodoListItem;
