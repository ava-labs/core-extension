import { ethErrors, serializeError } from 'eth-rpc-errors';
import EventEmitter from 'events';
import { getSiteMetadata } from './utils/getSiteMetadata';
import onDomReady from './utils/onDomReady';
import RequestRatelimiter from './utils/RequestRatelimiter';
import {
  AccountsChangedEventData,
  ChainChangedEventData,
  UnlockStateChangedEventData,
} from './models';
import {
  InitializationStep,
  ProviderReadyPromise,
} from './utils/ProviderReadyPromise';
import {
  DAppProviderRequest,
  JsonRpcRequest,
} from '../connections/dAppConnection/models';
import { ProviderInfo } from '../models';
import AbstractConnection from '../utils/messaging/AbstractConnection';

interface ProviderState {
  accounts: string[] | null;
  isConnected: boolean;
  isUnlocked: boolean;
  initialized: boolean;
}

export class CoreProvider extends EventEmitter {
  #contentScriptConnection: AbstractConnection;
  #requestRateLimiter = new RequestRatelimiter(['eth_requestAccounts']);
  #providerReadyPromise = new ProviderReadyPromise();

  readonly info: ProviderInfo = {
    name: EVM_PROVIDER_INFO_NAME,
    uuid: EVM_PROVIDER_INFO_UUID,
    icon: EVM_PROVIDER_INFO_ICON,
    description: EVM_PROVIDER_INFO_DESCRIPTION,
  };

  chainId: string | null = null;
  selectedAddress: string | null = null;
  /**
   * The network ID of the currently connected Ethereum chain.
   * @deprecated
   */
  networkVersion: string | null = null;
  isAvalanche = true;
  isMetaMask = true;

  _isReady = false;
  _isConnected = false;
  _initialized = false;
  _isUnlocked = false;

  _state: ProviderState = {
    accounts: null,
    isConnected: false,
    isUnlocked: false,
    initialized: false,
  };

  // Metamask compatibility
  _metamask = {
    isUnlocked: () => Promise.resolve(this._isUnlocked),
  };

  constructor({
    connection,
    maxListeners = 100,
  }: {
    connection: AbstractConnection;
    maxListeners?: number;
  }) {
    super();
    this.setMaxListeners(maxListeners);
    this.#contentScriptConnection = connection;
    this.#init();
  }

  /**
   * Initializes provider state,  and collects dApp information
   */
  #init = async () => {
    await this.#contentScriptConnection.connect();
    this.#contentScriptConnection.on('message', this.#handleBackgroundMessage);

    onDomReady(async () => {
      const domainMetadata = await getSiteMetadata();

      this.#requestInternal({
        method: DAppProviderRequest.DOMAIN_METADATA_METHOD,
        params: domainMetadata,
      });

      this.#providerReadyPromise.check(InitializationStep.DOMAIN_METADATA_SENT);
    });

    try {
      const response = await this.#requestInternal({
        method: DAppProviderRequest.INIT_DAPP_STATE,
      });
      const { chainId, accounts, networkVersion, isUnlocked } =
        (response as {
          isUnlocked: boolean;
          chainId: string | null;
          networkVersion: string | null;
          accounts: string[];
        }) ?? {};

      if (isUnlocked) {
        this._isUnlocked = true;
        this._state.isUnlocked = true;
      }

      if (
        chainId &&
        chainId !== '0x0' &&
        networkVersion &&
        networkVersion !== 'loading'
      ) {
        this.chainId = chainId;
        this.networkVersion = networkVersion;
        this.#connect({ chainId });
        this.#chainChanged({
          chainId,
          networkVersion,
        });
      }

      this.#accountsChanged(accounts || []);

      this.#providerReadyPromise.check(
        InitializationStep.PROVIDER_STATE_LOADED
      );
    } catch (e) {
      console.error(e);
      // the provider will have a partial state, but still should be able to function
    } finally {
      this._initialized = true;
      this._state.initialized = true;
      this._isReady = true;
      this.emit('_initialized');
    }
  };

  #request = async (data: JsonRpcRequest) => {
    if (!data) {
      throw ethErrors.rpc.invalidRequest();
    }

    return this.#contentScriptConnection.request(data).catch((err) => {
      // If the error is already a JsonRPCErorr do not serialize them.
      // eth-rpc-errors always wraps errors if they have an unkown error code
      // even if the code is valid like 4902 for unrecognized chain ID.
      if (!!err.code && Number.isInteger(err.code) && !!err.message) {
        throw err;
      }
      throw serializeError(err);
    });
  };

  #requestInternal = (data) => {
    return this.#requestRateLimiter.call(data.method, () =>
      this.#request(data)
    );
  };

  #getEventHandler = (method: string): ((params: any) => void) => {
    const handlerMap = {
      connect: this.#connect,
      disconnect: this.#disconnect,
      accountsChanged: this.#accountsChanged,
      chainChanged: this.#chainChanged,
      avalanche_unlockStateChanged: this.#unlockStateChanged,
    };
    return handlerMap[method];
  };

  #handleBackgroundMessage = ({ method, params }) => {
    const eventHandler = this.#getEventHandler(method);
    if (eventHandler) {
      return eventHandler(params);
    }

    this.emit(method, params);
  };

  isConnected = () => {
    return true;
  };

  request = async (data: JsonRpcRequest) => {
    return this.#providerReadyPromise.call(() => {
      return this.#requestRateLimiter.call(data.method, () =>
        this.#request(data)
      );
    });
  };

  // shim to matamask legacy api
  sendAsync = (payload, callback) => {
    if (Array.isArray(payload)) {
      return Promise.all(
        payload.map(
          (item) =>
            new Promise((resolve) => {
              this.sendAsync(item, (err, res) => {
                // ignore error
                resolve(res);
              });
            })
        )
      ).then((result) => callback(null, result));
    }
    const { method, params, ...rest } = payload;
    this.request({ method, params })
      .then((result) => callback(null, { ...rest, method, result }))
      .catch((error) => callback(error, { ...rest, method, error }));
  };

  send = (payload, callback?) => {
    if (typeof payload === 'string' && (!callback || Array.isArray(callback))) {
      return this.request({
        method: payload,
        params: callback,
      }).then((result) => ({
        id: undefined,
        jsonrpc: '2.0',
        result,
      }));
    }

    if (typeof payload === 'object' && typeof callback === 'function') {
      return this.sendAsync(payload, callback);
    }

    let result;
    switch (payload.method) {
      case 'eth_accounts':
        result = this.selectedAddress ? [this.selectedAddress] : [];
        break;

      case 'eth_coinbase':
        result = this.selectedAddress || null;
        break;

      default:
        throw new Error(
          'Sync method not supported. Please provide a callback or use the `request` function.'
        );
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result,
    };
  };

  enable = () => {
    return this.request({ method: 'eth_requestAccounts' });
  };

  net_version = () => {
    return this.request({ method: 'net_version' });
  };

  #connect = (data: { chainId: string }) => {
    if (!this._isConnected) {
      this._isConnected = true;
      this._state.isConnected = true;
      this.emit('connect', data);
    }
  };

  #unlockStateChanged = ({
    accounts,
    isUnlocked,
  }: UnlockStateChangedEventData) => {
    if (isUnlocked) {
      this._isUnlocked = true;
      this._state.isUnlocked = true;
      this.#accountsChanged(accounts);
    } else {
      this._isUnlocked = false;
    }
  };

  #disconnect = () => {
    this._isConnected = false;
    this._state.isConnected = false;
    this._state.accounts = null;
    this.selectedAddress = null;
    const disconnectError = ethErrors.provider.disconnected();

    this.emit('accountsChanged', []);
    this.emit('disconnect', disconnectError);
    this.emit('close', disconnectError);
  };

  #accountsChanged = (accounts: AccountsChangedEventData) => {
    if (accounts?.[0] === this.selectedAddress) {
      return;
    }

    this.selectedAddress = accounts?.[0] ?? null;
    this._state.accounts = accounts;
    this.emit('accountsChanged', accounts);
  };

  #chainChanged = ({ chainId, networkVersion }: ChainChangedEventData) => {
    this.#connect({ chainId });

    if (chainId !== this.chainId) {
      this.chainId = chainId;
      this.emit('chainChanged', chainId);
    }

    if (networkVersion !== this.networkVersion) {
      this.networkVersion = networkVersion;
      this.emit('networkChanged', networkVersion);
    }
  };
}
