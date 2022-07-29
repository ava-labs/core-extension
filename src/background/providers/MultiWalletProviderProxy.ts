import { ethErrors } from 'eth-rpc-errors';
import { DAppProviderRequest } from '../connections/dAppConnection/models';
import { WalletExtensionType } from '../services/web3/models';
import { RequestArguments } from './BaseProvider';
import { messages } from './messages';
import { MetaMaskInpageProvider } from './MetaMaskInpageProvider';
import { Maybe } from './utils';
import { includes } from 'lodash';

class MultiWalletProviderProxy {
  private _providers: unknown[] = [];

  private _defaultProvider;

  public get defaultProvider() {
    return this._defaultProvider;
  }
  public get providers() {
    return [...this._providers];
  }

  addProvider(provider) {
    // the COINBASE collects here the wallets
    if (provider.providerMap) {
      for (const providerProxy of provider.providerMap.values()) {
        if (!includes(this._providers, providerProxy)) {
          this._providers.push(providerProxy);
        }
      }
      return;
    }

    // the coinbase would add another proxy which is useless for us
    if (provider.coinbaseWalletInstalls) {
      return;
    }
    if (!includes(this._providers, provider)) {
      this._providers.push(provider);
    }
  }

  public getWalletExtensionType(provider) {
    if (provider.isAvalanche) {
      return WalletExtensionType.CORE;
    }
    // TODO: investigate why rabby doesn't open and how we can get back the other wallets if that's there
    if (provider.isRabby) {
      return WalletExtensionType.RABBY;
    }
    if (provider.isCoinbaseWallet) {
      return WalletExtensionType.COINBASE;
    }
    if (provider.isMetaMask) {
      return WalletExtensionType.METAMASK;
    }
    return WalletExtensionType.UNKNOWN;
  }

  private async toggleWalletSelection(): Promise<void> {
    // get users wallet selection
    const selectedIndex = await this.coreProvider.request({
      method: 'avalanche_selectWallet',
      params: [
        // using any since we don't really know what kind of provider they are
        this.providers.map((p: any, i) => {
          const type = this.getWalletExtensionType(p);

          return {
            index: i,
            type,
          };
        }),
      ],
    });

    // set default wallet for this connection
    this._defaultProvider =
      this.providers[selectedIndex] || this._defaultProvider;
  }

  constructor(private coreProvider: any) {
    this._defaultProvider = coreProvider;
    this._providers.push(coreProvider);
  }

  async enable(): Promise<string[]> {
    await this.toggleWalletSelection();

    return this._defaultProvider.enable();
  }

  // implement request to intercept `eth_requestAccounts`
  // so that users can select which provider they want to use
  async request<T>(args: RequestArguments): Promise<Maybe<T>> {
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
      this.providers.length > 1
    ) {
      await this.toggleWalletSelection();
    }

    // default provider is selected, let call through
    return this.defaultProvider.request(args);
  }
}

export function createMultiWalletProxy(coreProvider: MetaMaskInpageProvider) {
  const proxyProvider = new MultiWalletProviderProxy(coreProvider);
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

      // otherwise forward to the default provider
      return Reflect.get(proxyProvider.defaultProvider, prop, receiver);
    },
    set(obj, prop, value) {
      if (prop === '_events' || prop === '_defaultProvider') {
        Reflect.set(obj, prop, value);
      }
      return true;
    },
  });
}
