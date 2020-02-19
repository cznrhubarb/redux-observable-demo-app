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

export interface Request<TPayload = unknown> {
  type: RequestType;
  state: RequestState;
  payload: TPayload;
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

/**
 * Creates a request object with a payload of @TPayload type.
 * @typeparam Payload type parameter.
 * @param {TPayload} payload Payload of the request
 * @param {RequestType} [type=RequestType.create] Type of created request. _Defaults to RequestType.create_
 * @param {RequestState} [state=RequestState.inProgress] Initial state of created request. _Defaults to RequestState.inProgress_
 */
export const createRequest = <TPlayload>(
  payload: TPlayload,
  type: RequestType = RequestType.create,
  state: RequestState = RequestState.inProgress
): Request<TPlayload> => ({
  type,
  state,
  payload,
});

export const canUpdate = <TPayload>(
  request: Request<TPayload>,
  type?: RequestType
) => (request.state === RequestState.inProgress ? request.type === type : true);

export const updateRequest = <TPayload>(
  request: Request<TPayload>,
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
      } as Request<TPayload>)
    : request;
