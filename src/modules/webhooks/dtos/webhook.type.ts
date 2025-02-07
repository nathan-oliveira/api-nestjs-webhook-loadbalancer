export type TWebHookInterceptor = {
  hook: string;
  method: string;
  payload?: object;
  urlParams?: object;
};

export type TWebHookEvent = {
  eventPayload: object;
  eventId: number;
  urlParams: object;
};
