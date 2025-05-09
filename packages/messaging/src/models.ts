import { JsonRpcRequest } from '@core/types';

export type Response = {
  type: 'response';
  id: string;
  res: unknown;
  err: unknown;
};

export type Request = {
  type: 'request';
  id: string;
  data: JsonRpcRequest;
};

export type Message =
  | {
      type: 'message';
      data: unknown;
    }
  | Request
  | Response;

export const isResponse = (message: Message): message is Response => {
  return message.type === 'response';
};

export const isRequest = (message: Message): message is Request => {
  return message.type === 'request';
};
