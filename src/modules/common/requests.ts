export enum RequestState {
  inProgress = "inProgress", // Request is processing
  success = "success", // Request finished and succeeds
  error = "error", // Request finished and failed
}

export enum RequestType {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
}

export interface Request<P = unknown> {
  type: RequestType;
  state: RequestState;
  payload: P;
  error?: Error;
}

export const matchRequest = (
  type: RequestType,
  state: RequestState | RequestState[]
) => (request: Request) =>
  request.type === type &&
  (Array.isArray(state)
    ? state.includes(request.state)
    : request.state === state);

export const createRequest = <T>(
  payload: T,
  type: RequestType = RequestType.create,
  state: RequestState = RequestState.inProgress
): Request<T> => ({
  type,
  state,
  payload,
});

export const canUpdate = <T>(request: Request<T>, type?: RequestType) =>
  request.state === RequestState.inProgress ? request.type === type : true;

export const updateRequest = <T>(
  request: Request<T>,
  state: RequestState,
  type: RequestType,
  error?: string // Error object is not serializable so just use string
) =>
  canUpdate(request, type)
    ? ({
        ...request,
        state,
        error,
        type,
      } as Request<T>)
    : request;
