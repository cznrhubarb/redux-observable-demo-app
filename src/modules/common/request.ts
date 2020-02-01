import { Item } from "./models";

export enum RequestState {
  initial = "initial", // Not processed yet
  in_progress = "in_progress", // Request is processing
  success = "success", // Request finished and succeeds
  error = "error", // Request finished and failed
  canceled = "canceled", //  Request canceled by user
}

export enum RequestType {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
}

export interface Request<P = void> {
  type: RequestType | string;
  state: RequestState;
  payload?: P;
  error?: Error;
}

export const requestSymbol = Symbol("request");

export interface ItemWithRequest<P = void> extends Item {
  [requestSymbol]?: Request<P>;
}

export function getRequest(item: ItemWithRequest): Request | undefined {
  return item[requestSymbol];
}

export function setRequest<T extends ItemWithRequest>(
  item: T,
  request: Request
): T {
  const activeRequest = getRequest(item);

  const activeRequestInProgress =
    activeRequest &&
    [RequestState.initial, RequestState.in_progress].includes(
      activeRequest.state
    );
  const sameRequestType = activeRequest?.type === request.type;

  if (!activeRequestInProgress || sameRequestType) {
    return { ...item, [requestSymbol]: request };
  }

  return item;
}

export function setRequestOnListItem<T extends ItemWithRequest>(
  list: T[],
  itemId: T["id"],
  request: Request
): T[] {
  const itemIndex = list.findIndex(i => i.id === itemId);
  if (itemIndex !== -1) {
    return Object.assign([], list, {
      [itemIndex]: setRequest(list[itemIndex], request),
    });
  }

  return list;
}

export function isMatchingRequest(
  request: Request | undefined,
  state: RequestState | RequestState[],
  type?: RequestType
): boolean {
  if (!request) {
    return false;
  }

  if (type && request.type !== type) {
    return false;
  }

  if (Array.isArray(state)) {
    return state.includes(request.state);
  }

  return request.state === state;
}
