import { Item } from "./models";

export enum RequestState {
  initial = "initial", // Not processed yet
  inProgress = "inProgress", // Request is processing
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

export interface WithRequest<P = void> {
  [requestSymbol]?: Request<P>;
}

export function getRequest<P>(item: WithRequest<P>): Request<P> | undefined {
  return item[requestSymbol];
}

export function setRequest<T extends WithRequest<P>, P>(
  item: T,
  request: Request<P>
): T {
  const activeRequest = getRequest(item);

  const activeRequestInProgress =
    activeRequest &&
    [RequestState.initial, RequestState.inProgress].includes(
      activeRequest.state
    );
  const sameRequestType = activeRequest?.type === request.type;

  if (!activeRequestInProgress || sameRequestType) {
    return { ...item, [requestSymbol]: request };
  }

  return item;
}

export function setRequestMutable<T extends WithRequest<P>, P>(
  item: T,
  request: Request<P>
): void {
  const { [requestSymbol]: newRequest } = setRequest(item, request);
  // eslint-disable-next-line no-param-reassign
  item[requestSymbol] = newRequest;
}

export interface ItemWithRequest extends Item, WithRequest {}

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

export function isMatching<P>(
  request: Request<P> | undefined,
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
    return state.length ? state.includes(request.state) : true;
  }

  return request.state === state;
}
