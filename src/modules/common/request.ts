import { Item } from "./models";

export enum RequestState {
  initial = "initial", // Not processed yet
  inProgress = "inProgress", // Request is processing
  success = "success", // Request finished and succeeds
  error = "error", // Request finished and failed
  canceled = "canceled", //  Request canceled by user
}

export enum RequestType {
  none = "default",
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
}

export type GenericRequest<P = undefined> = {
  readonly type: RequestType;
  state: RequestState;
  payload?: P;
  error?: Error;
};

export type RequestUpdate = {
  readonly type: RequestType;
  state: RequestState;
  error?: Error;
};

export const EmptyRequest: GenericRequest<never> = {
  type: RequestType.none,
  state: RequestState.success,
} as const;

export type CreateRequest<P> = GenericRequest<P> & {
  readonly type: RequestType.create;
  payload: P;
};

export type ReadRequest<P> = GenericRequest<P> & {
  readonly type: RequestType.read;
};

export type UpdateRequest<P> = GenericRequest<P> & {
  readonly type: RequestType.update;
  payload: P;
};

export type DeleteRequest<P> = GenericRequest<P> & {
  readonly type: RequestType.delete;
};

export type Request<P> =
  | typeof EmptyRequest
  | CreateRequest<P>
  | ReadRequest<P>
  | UpdateRequest<P>
  | DeleteRequest<P>;

export const requestSymbol = Symbol("request");

export type WithRequest<P> = {
  [requestSymbol]?: Request<P>;
};

export type ItemWithRequest<P> = Item & WithRequest<P>;

export function getRequest<P>(item: WithRequest<P>): Request<P> {
  return item[requestSymbol] ?? EmptyRequest;
}

export function hasRequest<P>(item: WithRequest<P>) {
  return Boolean(getRequest(item));
}

export function isOfType<P, RT extends Request<P>>(
  request: Request<P>,
  type: RequestType
): request is Request<P> extends { type: RequestType } ? RT : false {
  return request.type === type;
}

export function isInState<P>(
  request: Request<P>,
  stateList: RequestState[]
): boolean {
  return stateList.includes(request.state);
}

export function isMatching<P>(
  request: Request<P> | undefined,
  state: RequestState | RequestState[],
  type: RequestType
): boolean {
  if (!request) {
    return false;
  }

  if (!isInState(request, Array.isArray(state) ? state : [state])) {
    return false;
  }

  return isOfType(request, type);
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
    // eslint-disable-next-line no-param-reassign
    item[requestSymbol] = request;
  }

  return item;
}

export function updateRequest<T extends WithRequest<P>, P>(
  item: T,
  update: RequestUpdate
): T {
  if (
    hasRequest(item) &&
    isOfType(getRequest(item), update.type) &&
    isInState(getRequest(item), [RequestState.initial, RequestState.inProgress])
  ) {
    // eslint-disable-next-line no-param-reassign
    item[requestSymbol] = update;
  }

  return item;
}

export function setRequestOnListItem<T extends ItemWithRequest<P>, P>(
  list: T[],
  itemId: T["id"],
  request: Request<P>
): T[] {
  const item = list.find(i => i.id === itemId);

  if (item) {
    setRequest(item, request);
  }

  return list;
}

export function updateRequestOnListItem<T extends ItemWithRequest<P>, P>(
  list: T[],
  itemId: T["id"],
  update: RequestUpdate
): T[] {
  const item = list.find(i => i.id === itemId);

  if (item) {
    updateRequest(item, update);
  }

  return list;
}
