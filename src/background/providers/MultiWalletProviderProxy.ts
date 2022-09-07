import { ethErrors } from 'eth-rpc-errors';
import { JsonRpcRequest, JsonRpcResponse } from 'json-rpc-engine';
import { DAppProviderRequest } from '../connections/dAppConnection/models';
import { RequestArguments } from './BaseProvider';
import { messages } from './messages';
import {
  MetaMaskInpageProvider,
  SendSyncJsonRpcRequest,
} from './MetaMaskInpageProvider';
import { getWalletExtensionType, Maybe } from './utils';
import SafeEventEmitter from '@metamask/safe-event-emitter';

class MultiWalletProviderProxy extends SafeEventEmitter {
  #_providers: unknown[] = [];

  private _defaultProvider;

  public get defaultProvider() {
    return this._defaultProvider;
  }
  get #providers() {
    return [...this.#_providers];
  }

  private isWalletSelected = false;

  constructor(private coreProvider: MetaMaskInpageProvider) {
    super();

    this.addProvider = this.addProvider.bind(this);
    this.enable = this.enable.bind(this);
    this.send = this.send.bind(this);
    this.request = this.request.bind(this);
    this._request = this._request.bind(this);
    this.toggleWalletSelection = this.toggleWalletSelection.bind(this);

    this._defaultProvider = coreProvider;
    this.#_providers.push(coreProvider);

    // Listen for new event subscriptions on the multi wallet provider.
    // We subscribe to those events on the currently used provider so
    // that the they can be re-emitted by the proxy.
    this.addListener('newListener', (event) => {
      this._defaultProvider.addListener(event, (...args: any) => {
        this.emit(event, ...args);
      });
    });
  }

  public addProvider(provider) {
    // the COINBASE collects here the wallets
    if (provider.providerMap) {
      for (const providerProxy of provider.providerMap.values()) {
        if (!this.#providers.includes(providerProxy)) {
          this.#providers.push(providerProxy);
        }
      }
      return;
    }

    // the coinbase would add another proxy which is useless for us
    if (provider.coinbaseWalletInstalls) {
      return;
    }

    if (!this.#providers.includes(provider)) {
      this.#providers.push(provider);
    }
  }

  private async toggleWalletSelection(): Promise<void> {
    // no need to select a wallet when there is only one
    if (this.#providers.length === 1 || this.isWalletSelected) {
      return;
    }

    // get users wallet selection
    const selectedIndex = await this.coreProvider.request<number>({
      method: 'avalanche_selectWallet',
      params: [
        // using any since we don't really know what kind of provider they are
        this.#providers.map((p: any, i) => {
          const type = getWalletExtensionType(p);

          return {
            index: i,
            type,
          };
        }),
      ],
    });

    if (selectedIndex === undefined || selectedIndex === null) {
      return;
    }

    if (selectedIndex !== 0) {
      // Migrate event subscription to the new event provider
      this._defaultProvider.removeAllListeners();

      this.eventNames().forEach((event) => {
        if (event === 'newListener') {
          return;
        }

        (this.#providers[selectedIndex] as any)?.addListener(
          event,
          (...args: any[]) => {
            this.emit(event as string, ...args);
          }
        );
      });
    }

    // store selection if successful to prevent showing selection popup multiple times
    // some dApps call eth_requestAccounts multiple times
    if (this.#providers[selectedIndex]) {
      this.isWalletSelected = true;
    }

    // set default wallet for this connection
    this._defaultProvider =
      this.#providers[selectedIndex] || this._defaultProvider;
  }

  private async _request<T>(args: RequestArguments): Promise<Maybe<T>> {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestArgs(),
        data: args,
      });
    }

    const { method } = args;

    // trigger wallet selection flow at connect in case multiple providers are available
    if (
      method === DAppProviderRequest.CONNECT_METHOD &&
      this.#providers.length > 1
    ) {
      await this.toggleWalletSelection();
    }

    // default provider is selected, let call through
    return this.defaultProvider.request(args);
  }

  async enable(): Promise<string[]> {
    await this.toggleWalletSelection();

    return this._defaultProvider.enable();
  }

  // implement request to intercept `eth_requestAccounts`
  // so that users can select which provider they want to use
  async request<T>(args: RequestArguments): Promise<Maybe<T>> {
    return this._request(args);
  }

  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @param payload - The RPC request object.
   * @param callback - The callback function.
   */
  sendAsync(
    payload: JsonRpcRequest<unknown[]>,
    callback: (error: Error | null, result?: JsonRpcResponse<unknown[]>) => void
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
    payload: JsonRpcRequest<unknown>,
    callback: (error: Error | null, result?: JsonRpcResponse<T>) => void
  ): void;

  /**
   * Accepts a JSON-RPC request object, and synchronously returns the cached result
   * for the given method. Only supports 4 specific RPC methods.
   *
   * @deprecated Use "request" instead.
   * @param payload - A JSON-RPC request object.
   * @returns A JSON-RPC response object.
   */
  send<T>(payload: SendSyncJsonRpcRequest): JsonRpcResponse<T>;

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
    return this.defaultProvider.send(methodOrPayload, callbackOrArgs);
  }
}

export function createMultiWalletProxy(coreProvider: MetaMaskInpageProvider) {
  const proxyProvider = new MultiWalletProviderProxy(coreProvider);
  // Some dApps like Pangolin likes to define helper methods on the window.ethereum object.
  // Store them separately to prevent them from altering the inpage provider behaviour
  const walletProviderExtensions = {};

  return new Proxy(proxyProvider, {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true,

    // intercept unknow calls that are meant to be handled by the current provider
    // and forward them if needed so that we don't have to implement all the custom
    // functions any given wallet provider might expose
    get: (target, prop, receiver) => {
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
    set(obj, prop, value) {
      Reflect.set(walletProviderExtensions, prop, value);
      return true;
    },
  });
}
