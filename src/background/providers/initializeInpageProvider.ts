import { Duplex } from 'stream';
import {
  MetaMaskInpageProvider,
  MetaMaskInpageProviderOptions,
} from './MetaMaskInpageProvider';
import { createMultiWalletProxy } from './MultiWalletProviderProxy';

interface InitializeProviderOptions extends MetaMaskInpageProviderOptions {
  /**
   * The stream used to connect to the wallet.
   */
  connectionStream: Duplex;

  /**
   * Whether the provider should be set as window.ethereum.
   */
  shouldSetOnWindow?: boolean;

  /**
   * Whether the window.web3 shim should be set.
   */
  shouldShimWeb3?: boolean;
}

/**
 * Initializes a MetaMaskInpageProvider and (optionally) assigns it as window.ethereum.
 *
 * @param options - An options bag.
 * @param options.connectionStream - A Node.js stream.
 * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
 * @param options.maxEventListeners - The maximum number of event listeners.
 * @param options.shouldSendMetadata - Whether the provider should send page metadata.
 * @param options.shouldSetOnWindow - Whether the provider should be set as window.ethereum.
 * @param options.shouldShimWeb3 - Whether a window.web3 shim should be injected.
 * @returns The initialized provider (whether set or not).
 */
export function initializeProvider({
  connectionStream,
  logger = console,
  maxEventListeners = 100,
  shouldSendMetadata = true,
  shouldSetOnWindow = true,
}: InitializeProviderOptions): MetaMaskInpageProvider {
  let provider = new MetaMaskInpageProvider(connectionStream, {
    logger,
    maxEventListeners,
    shouldSendMetadata,
  });

  provider = new Proxy(provider, {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true,
  });

  if (shouldSetOnWindow) {
    setGlobalProvider(provider);
    setAvalancheGlobalProvider(provider);
  }

  return provider;
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
export function setGlobalProvider(
  providerInstance: MetaMaskInpageProvider
): void {
  try {
    const multiWalletProxy = createMultiWalletProxy(providerInstance);

    // if we already have a wallet lets add it
    if ((window as any).ethereum) {
      multiWalletProxy.addProvider((window as any).ethereum);
    }

    Object.defineProperty(window, 'ethereum', {
      get: () => {
        return multiWalletProxy;
      },
      // in case a wallet tries to overwrite us lets add them to the list
      set: (value) => {
        multiWalletProxy.addProvider(value);
      },
    });

    Object.defineProperty(window, 'web3', {
      get: () => {
        return {
          currentProvider: multiWalletProxy,
        };
      },
      // in case a wallet tries to overwrite us lets add them to the list
      set: () => {
        return true;
      },
    });
    window.dispatchEvent(new Event('ethereum#initialized'));
  } catch (e) {
    // some browser was faster and defined the window.ethereum as non writable before us
    console.error('Cannot set Core window.ethereum provider', e);

    // try to set the providerInstance in case it's a proxy like we are
    (window as any).ethereum = providerInstance;
  }
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
export function setAvalancheGlobalProvider(
  providerInstance: MetaMaskInpageProvider
): void {
  Object.defineProperty(window, 'avalanche', {
    value: providerInstance,
    writable: false,
  });
  window.dispatchEvent(new Event('avalanche#initialized'));
}
