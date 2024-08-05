import EventEmitter from 'events';
import {
  JsonRpcRequest,
  JsonRpcRequestPayload,
} from '../connections/dAppConnection/models';
import { PartialBy } from '../models';
import { ethErrors, serializeError } from 'eth-rpc-errors';
import AbstractConnection from '../utils/messaging/AbstractConnection';
import { ChainId } from '@avalabs/core-chains-sdk';
import RequestRatelimiter from './utils/RequestRatelimiter';

export class ChainAgnosticProvider extends EventEmitter {
  #contentScriptConnection: AbstractConnection;

  #requestRateLimiter = new RequestRatelimiter([
    'eth_requestAccounts',
    'avalanche_selectWallet',
  ]);

  constructor(connection) {
    super();
    this.#contentScriptConnection = connection;
    this.#init();
  }

  async #init() {
    await this.#contentScriptConnection.connect();
  }

  #request = async ({
    data,
    sessionId,
    chainId,
  }: {
    data: PartialBy<JsonRpcRequestPayload, 'id' | 'params'>;
    sessionId?: string;
    chainId?: string | null;
  }) => {
    if (!data) {
      throw ethErrors.rpc.invalidRequest();
    }

    const result = this.#contentScriptConnection
      .request({
        method: 'provider_request',
        jsonrpc: '2.0',
        params: {
          scope: `eip155:${
            chainId ? parseInt(chainId) : ChainId.AVALANCHE_MAINNET_ID
          }`,
          sessionId,
          request: {
            params: [],
            ...data,
          },
        },
      } as JsonRpcRequest)
      .catch((err) => {
        // If the error is already a JsonRPCErorr do not serialize them.
        // eth-rpc-errors always wraps errors if they have an unkown error code
        // even if the code is valid like 4902 for unrecognized chain ID.
        if (!!err.code && Number.isInteger(err.code) && !!err.message) {
          throw err;
        }
        throw serializeError(err);
      });
    return result;
  };

  request = async ({
    data,
    sessionId,
    chainId,
  }: {
    data: PartialBy<JsonRpcRequestPayload, 'id' | 'params'>;
    sessionId: string;
    chainId: string | null;
  }) => {
    return this.#requestRateLimiter.call(data.method, () =>
      this.#request({ data, chainId, sessionId })
    );
  };

  subscribeToMessage = (callback) => {
    this.#contentScriptConnection.on('message', callback);
  };
}
