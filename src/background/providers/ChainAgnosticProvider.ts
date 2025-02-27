import EventEmitter from 'events';
import {
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcRequestPayload,
} from '../connections/dAppConnection/models';
import { PartialBy } from '../models';
import { ethErrors, serializeError } from 'eth-rpc-errors';
import AbstractConnection from '../utils/messaging/AbstractConnection';
import RequestRatelimiter from './utils/RequestRatelimiter';
import {
  InitializationStep,
  ProviderReadyPromise,
} from './utils/ProviderReadyPromise';
import onDomReady from './utils/onDomReady';
import { getSiteMetadata } from './utils/getSiteMetadata';
import { chainIdToCaip } from '../../utils/caipConversion';

export class ChainAgnosticProvider extends EventEmitter {
  #contentScriptConnection: AbstractConnection;
  #providerReadyPromise = new ProviderReadyPromise([
    InitializationStep.DOMAIN_METADATA_SENT,
  ]);

  #requestRateLimiter = new RequestRatelimiter([
    'eth_requestAccounts',
    'avalanche_selectWallet',
  ]);

  constructor(connection) {
    super();
    connection.connect();
    this.#contentScriptConnection = connection;
    this.#init();
  }

  async #init() {
    await this.#contentScriptConnection.connect();

    onDomReady(async () => {
      const domainMetadata = await getSiteMetadata();

      this.#request({
        data: {
          method: DAppProviderRequest.DOMAIN_METADATA_METHOD,
          params: domainMetadata,
        },
      });

      this.#providerReadyPromise.check(InitializationStep.DOMAIN_METADATA_SENT);
    });
  }

  // If the namespace is EIP155 and the reference is a known fake chain ID (e.g. Bitcoin or Avalanche X/P chains),
  // we convert it to the corresponding CAIP-2 chain ID. Otherwise, we return the original scope.
  #normalizeScope = (scope?: string | null) => {
    // Do not touch empty or non-EVM chain ids
    if (scope === null || scope === undefined || !scope.startsWith('eip155:')) {
      return scope;
    }

    const [_, chainId] = scope.split(':');

    return chainIdToCaip(Number(chainId));
  };

  #request = async ({
    data,
    sessionId,
    scope,
  }: {
    data: PartialBy<JsonRpcRequestPayload, 'id' | 'params'>;
    sessionId?: string;
    scope?: string | null;
  }) => {
    if (!data) {
      throw ethErrors.rpc.invalidRequest();
    }

    const result = this.#contentScriptConnection
      .request({
        method: 'provider_request',
        jsonrpc: '2.0',
        params: {
          scope: this.#normalizeScope(scope),
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
    scope,
  }: {
    data: PartialBy<JsonRpcRequestPayload, 'id' | 'params'>;
    sessionId?: string;
    scope?: string | null;
  }) => {
    return this.#providerReadyPromise.call(() => {
      return this.#requestRateLimiter.call(data.method, () =>
        this.#request({ data, scope, sessionId }),
      );
    });
  };

  subscribeToMessage = (callback) => {
    this.#contentScriptConnection.on('message', callback);
  };
}
