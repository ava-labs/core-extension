import { DEFERRED_RESPONSE } from '../../service-worker/src/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { EventEmitter } from 'events';
import { isDevelopment } from '../../utils/src/environment';
import { isRequest, isResponse, Message, Request, Response } from './models';
import { JsonRpcRequest } from '@core/service-worker';
import { PartialBy } from '@core/service-worker';

export abstract class AbstractConnection extends EventEmitter {
  #concurrentRequestLimit: number;
  #listenCallback?: (data: any) => void;

  #waitingMap = new Map<
    string,
    {
      data: any;
      resolve: (arg: unknown) => void;
      reject: (arg: unknown) => void;
    }
  >();

  constructor(concurrentRequestLimit = 1000) {
    super();

    this.#concurrentRequestLimit = concurrentRequestLimit;
  }

  protected abstract _send(message: Message): void;
  protected abstract _connect(): Promise<void>;
  protected abstract _disconnect(): void;

  connect = async (listenCallback?: (message: any) => void) => {
    this.#listenCallback = listenCallback;

    await this._connect();
  };

  message = (data: unknown) => {
    this._send({ type: 'message', data });
  };

  deferredResponse = (id: string, res: unknown, err: unknown) => {
    this._send({ type: 'response', id, res, err });
  };

  request = (data: PartialBy<JsonRpcRequest, 'id'>) => {
    if (this.#waitingMap.size >= this.#concurrentRequestLimit) {
      throw ethErrors.rpc.limitExceeded();
    }

    const id = crypto.randomUUID();
    const requestData: JsonRpcRequest = {
      ...data,
      params: {
        ...data.params,
        request: {
          ...data.params.request,
          id,
        },
      },
      id,
    };

    return new Promise((resolve, reject) => {
      this.#waitingMap.set(requestData.id, {
        data: requestData,
        resolve,
        reject,
      });

      this._send({ type: 'request', id: requestData.id, data: requestData });
    });
  };

  dispose = () => {
    for (const request of this.#waitingMap.values()) {
      request.reject(ethErrors.provider.userRejectedRequest());
    }

    this.#waitingMap.clear();
    this._disconnect();
  };

  #onResponse = async ({ id, res, err }: Response) => {
    const request = this.#waitingMap.get(id);
    if (!request) {
      return;
    }

    const { resolve, reject } = request;

    this.#waitingMap.delete(id);
    if (err) {
      reject(err);
      return;
    }
    resolve(res);
  };

  protected onMessage = (message: Message) => {
    if (message.type === 'message') {
      this.emit('message', message.data);
    } else if (isResponse(message)) {
      this.#onResponse(message);
    } else if (isRequest(message)) {
      this.#onRequest(message);
    }
  };

  #onRequest = async ({ id, data }: Request) => {
    if (!this.#listenCallback) {
      return;
    }

    let res, err;

    try {
      res = await this.#listenCallback({ ...data });
    } catch (e: any) {
      err = {
        message: e.message,
      };
      if (isDevelopment()) {
        err.stack = e.stack;
      }
      if (e.code !== undefined) {
        err.code = e.code;
      }
      if (e.data !== undefined) {
        err.data = e.data;
      }
    }

    if (res === DEFERRED_RESPONSE) {
      // the response is going to be returned as a message
      // i.e. after the user has approved / rejected the request
      return;
    }

    this._send({ type: 'response', id, res, err });
  };
}
