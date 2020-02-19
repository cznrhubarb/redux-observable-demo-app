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
  RequestState as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";
import { TodoStateItem } from "../models";

export interface Props {
  item: TodoStateItem;
  divider?: boolean;
  onDeleteButtonClick?: () => void;
  onCheckBoxToggle?: () => void;
}

const TodoText = styled(ListItemText)`
  color: ${props => props.theme.color.black};
`;

const TodoListItem: React.FC<Props> = memo(props => {
  const { item, divider, onDeleteButtonClick, onCheckBoxToggle } = props;

  return (
    <ListItem divider={divider}>
      {matchRequest(RT.update, RS.inProgress)(item.request) ? (
        <CircularProgress size={42} color="secondary" />
      ) : (
        <Checkbox onClick={onCheckBoxToggle} checked={item.data.completed} />
      )}

      <TodoText
        primary={item.data.text}
        secondary={
          item.request && `Request ${item.request.type} ${item.request.state}`
        }
      />

      {!matchRequest(RT.delete, [RS.inProgress, RS.error])(item.request) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={onDeleteButtonClick}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {matchRequest(RT.delete, RS.error)(item.request) ? (
        <ListItemSecondaryAction>
          <IconButton aria-label="Retry Todo" onClick={onDeleteButtonClick}>
            <RepeatRounded />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}

      {matchRequest(RT.delete, RS.inProgress)(item.request) ? (
        <ListItemSecondaryAction>
          <CircularProgress size={42} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
});

export default TodoListItem;
