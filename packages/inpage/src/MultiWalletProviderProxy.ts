import EventEmitter from 'events';
import { ethErrors } from 'eth-rpc-errors';
import { Maybe } from '@avalabs/core-utils-sdk';
import { EVMProvider } from '@avalabs/evm-module/dist/provider';

import type {
  DAppProviderRequest,
  JsonRpcRequestPayload,
  JsonRpcResponse,
} from '@core/types';

const CONNECT_METHODS = [
  'eth_requestAccounts',
  'wallet_requestAccountPermission',
  'wallet_requestPermissions',
] as const as DAppProviderRequest[];

export class MultiWalletProviderProxy extends EventEmitter {
  #_providers: EVMProvider[] = [];
  #isWalletSelected = false;
  #isWalletSelectionPending = false;
  #defaultProvider;

  public get defaultProvider() {
    return this.#defaultProvider;
  }
  get providers() {
    // When the user decides to select the providers and there is more than one provider and EVMProvider is selected, we want to trigger the wallet selection. So we replace EVMProvider with this.
    if (this.#_providers.length > 1) {
      return [...this.#_providers].map((provider) => {
        if ((provider as EVMProvider)?.isAvalanche) {
          return new Proxy(this, {
            get(target, prop) {
              // eslint-disable-next-line no-prototype-builtins
              if (target.hasOwnProperty(prop)) {
                return target[prop];
                // eslint-disable-next-line no-prototype-builtins
              } else if ((provider as EVMProvider).hasOwnProperty(prop)) {
                return (provider as EVMProvider)[prop];
              }
            },
          });
        }
        return provider;
      });
    }

    return [...this.#_providers];
  }

  constructor(private coreProvider: EVMProvider) {
    super();

    this.addProvider = this.addProvider.bind(this);
    this.enable = this.enable.bind(this);
    this.send = this.send.bind(this);
    this.request = this.request.bind(this);
    this._request = this._request.bind(this);

    this.#defaultProvider = coreProvider;

    this.#_providers.push(coreProvider);

    // Listen for new event subscriptions on the multi wallet provider.
    // We subscribe to those events on the currently used provider so
    // that the they can be re-emitted by the proxy.
    this.addListener('newListener', (event) => {
      this.#defaultProvider.addListener(event, (...args: any) => {
        this.emit(event, ...args);
      });
    });
  }

  public addProvider(providerDetail) {
    const isProviderAdded = this.#_providers.find((provider) => {
      return provider.info.uuid === providerDetail.info.uuid;
    });

    if (!isProviderAdded) {
      this.#_providers.push(providerDetail);
    }
  }

  async #toggleWalletSelection(): Promise<void> {
    // no need to select a wallet when there is only one
    if (
      this.#_providers.length === 1 ||
      this.#isWalletSelected ||
      this.#isWalletSelectionPending
    ) {
      return;
    }

    this.#isWalletSelectionPending = true;

    // get users wallet selection
    const selectedIndex = await this.coreProvider
      .request({
        method: 'avalanche_selectWallet',
        params: [
          // using any since we don't really know what kind of provider they are
          this.#_providers.map((p: any, i) => {
            return {
              index: i,
              info: p.info,
            };
          }),
        ],
      })
      .catch(() => {
        this.#isWalletSelectionPending = false;
      });

    if (
      selectedIndex === undefined ||
      selectedIndex === null ||
      typeof selectedIndex !== 'number'
    ) {
      return;
    }

    if (selectedIndex !== 0) {
      // Migrate event subscription to the new event provider
      this.#defaultProvider.removeAllListeners();
      this.eventNames().forEach((event) => {
        if (event === 'newListener') {
          return;
        }

        (this.#_providers[selectedIndex] as any)?.addListener?.(
          event,
          (...args: any[]) => {
            this.emit(event as string, ...args);
          },
        );
      });
    }

    // store selection if successful to prevent showing selection popup multiple times
    // some dApps call eth_requestAccounts multiple times
    if (this.#_providers[selectedIndex]) {
      this.#isWalletSelected = true;
    }

    // set default wallet for this connection
    this.#defaultProvider =
      this.#_providers[selectedIndex] || this.#defaultProvider;

    this.#isWalletSelectionPending = false;
  }

  private async _request<T>(args): Promise<Maybe<T>> {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw ethErrors.rpc.invalidRequest({
        message: ethErrors.rpc.invalidRequest().message,
        data: args,
      });
    }

    const { method } = args;

    // trigger wallet selection flow at connect in case multiple providers are available
    if (CONNECT_METHODS.includes(method) && this.#_providers.length > 1) {
      await this.#toggleWalletSelection();
    }

    // default provider is selected, let call through
    return this.defaultProvider.request(args);
  }

  async enable(): Promise<string[]> {
    await this.#toggleWalletSelection();

    return this.#defaultProvider.enable();
  }

  // implement request to intercept `eth_requestAccounts`
  // so that users can select which provider they want to use
  async request<T>(args): Promise<Maybe<T>> {
    return this._request(args);
  }

  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @param payload - The RPC request object.
   * @param callback - The callback function.
   */
  sendAsync(
    payload: JsonRpcRequestPayload,
    callback: (
      error: Error | null,
      result?: JsonRpcResponse<unknown[]>,
    ) => void,
  ): void {
    this._request(payload)
      .then((result: any) => {
        callback(null, {
          ...payload,
          result,
        });
      })
      .catch((e) => {
        callback(e);
      });
  }

  /**
   * Submits an RPC request for the given method, with the given params.
   *
   * @deprecated Use "request" instead.
   * @param method - The method to request.
   * @param params - Any params for the method.
   * @returns A Promise that resolves with the JSON-RPC response object for the
   * request.
   */
  send<T>(method: string, params?: T[]): Promise<JsonRpcResponse<T>>;

  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @deprecated Use "request" instead.
   * @param payload - A JSON-RPC request object.
   * @param callback - An error-first callback that will receive the JSON-RPC
   * response object.
   */
  send<T>(
    payload: JsonRpcRequestPayload,
    callback: (error: Error | null, result?: JsonRpcResponse<T>) => void,
  ): void;

  /**
   * Accepts a JSON-RPC request object, and synchronously returns the cached result
   * for the given method. Only supports 4 specific RPC methods.
   *
   * @deprecated Use "request" instead.
   * @param payload - A JSON-RPC request object.
   * @returns A JSON-RPC response object.
   */
  send<T>(payload): JsonRpcResponse<T>;

  // this is needed because there are multiple dApps which love to use an old deprecated method
  send(methodOrPayload: unknown, callbackOrArgs?: unknown): unknown {
    if (
      typeof methodOrPayload === 'string' &&
      (!callbackOrArgs || Array.isArray(callbackOrArgs))
    ) {
      return this._request({
        method: methodOrPayload,
        params: callbackOrArgs as unknown[],
      });
    }

    return this.sendAsync(methodOrPayload as any, callbackOrArgs as any);
  }
}

export function createMultiWalletProxy(evmProvider: EVMProvider) {
  const proxyProvider = new MultiWalletProviderProxy(evmProvider);
  // Some dApps like Pangolin likes to define helper methods on the window.ethereum object.
  // Store them separately to prevent them from altering the inpage provider behaviour
  const walletProviderExtensions = {};

  return new Proxy(proxyProvider, {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true,

    // intercept unknow calls that are meant to be handled by the current provider
    // and forward them if needed so that we don't have to implement all the custom
    // functions any given wallet provider might expose
    get: (_, prop, receiver) => {
      // if the proxy has the function call it
      if (proxyProvider[prop]) {
        return proxyProvider[prop];
      }

      if (proxyProvider.defaultProvider[prop]) {
        // otherwise forward to the default provider
        return Reflect.get(proxyProvider.defaultProvider, prop, receiver);
      }

      // check if the request param is an extension defined by the dApp
      return Reflect.get(walletProviderExtensions, prop, receiver);
    },
    set(_, prop, value) {
      Reflect.set(walletProviderExtensions, prop, value);
      return true;
    },
  });
}
