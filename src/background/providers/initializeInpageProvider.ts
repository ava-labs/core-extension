import type AbstractConnection from '../utils/messaging/AbstractConnection';
import { ChainAgnosticProvider } from './ChainAgnosticProvider';
import { createMultiWalletProxy } from './MultiWalletProviderProxy';
import { EventNames, type EIP6963ProviderDetail } from './models';
import { EVMProvider } from '@avalabs/evm-module/dist/provider';

/**
 * Initializes a CoreProvide and assigns it as window.ethereum.
 *
 * @param connection - Communication channel name to communicate with the contentscript on
 * @param maxListeners - The maximum number of event listeners.
 * @param globalObject - Defaults to window. Defines what to set the provider on.
 * @returns The initialized provider (whether set or not).
 */
export function initializeProvider(
  connection: AbstractConnection,
  maxListeners = 100,
  globalObject = window
): EVMProvider {
  const chainAgnosticProvider = new Proxy(
    new ChainAgnosticProvider(connection),
    {
      deleteProperty: () => true,
    }
  );

  const evmProvider = new Proxy(
    new EVMProvider({
      maxListeners,
      info: {
        name: EVM_PROVIDER_INFO_NAME,
        uuid: EVM_PROVIDER_INFO_UUID,
        icon: EVM_PROVIDER_INFO_ICON,
        description: EVM_PROVIDER_INFO_DESCRIPTION,
        rdns: EVM_PROVIDER_INFO_RDNS,
      },
    }),
    {
      get(...args) {
        // Core Web needs to know which extension version it's working with
        if (args[1] === 'coreVersion') {
          // For local (dev) builds, CORE_EXTENSION_VERSION is 0.0.0
          // For release builds (alpha or production), it's replaced by semantic-release to the actual version number
          return CORE_EXTENSION_VERSION;
        }

        return Reflect.get(...args);
      },
      // some common libraries, e.g. web3@1.x, mess with our API
      deleteProperty: () => true,
    }
  );

  setGlobalProvider(evmProvider, globalObject);
  setAvalancheGlobalProvider(evmProvider, globalObject);
  setEvmproviders(evmProvider, globalObject);
  announceWalletProvider(evmProvider, globalObject);
  announceChainAgnosticProvider(chainAgnosticProvider, globalObject);

  return evmProvider;
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
function setGlobalProvider(
  providerInstance: EVMProvider,
  globalObject = window
): void {
  try {
    const multiWalletProxy = createMultiWalletProxy(providerInstance);

    // if we already have a wallet lets add it
    if (globalObject.ethereum) {
      multiWalletProxy.addProvider(globalObject.ethereum);
    }

    Object.defineProperty(globalObject, 'ethereum', {
      get: () => {
        return multiWalletProxy;
      },
      // in case a wallet tries to overwrite us lets add them to the list
      set: (value) => {
        multiWalletProxy.addProvider(value);
      },
    });

    let windowWeb3Obj = {
      currentProvider: multiWalletProxy,
    };

    Object.defineProperty(globalObject, 'web3', {
      get: () => {
        return windowWeb3Obj;
      },
      // let dApps define window.web3.eth and similar extensions to the window.web3 object
      set: (value) => {
        if (value.__isMetaMaskShim__) return;

        windowWeb3Obj = {
          ...value,
          currentProvider: multiWalletProxy,
        };

        return true;
      },
    });
    globalObject.dispatchEvent(new Event('ethereum#initialized'));
  } catch (e) {
    // some browser was faster and defined the window.ethereum as non writable before us
    console.error('Cannot set Core window.ethereum provider', e);

    // try to set the providerInstance in case it's a proxy like we are
    globalObject.ethereum = providerInstance;
  }
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
function setAvalancheGlobalProvider(
  providerInstance: EVMProvider,
  globalObject = window
): void {
  Object.defineProperty(globalObject, 'avalanche', {
    value: providerInstance,
    writable: false,
  });
  globalObject.dispatchEvent(new Event('avalanche#initialized'));
}

function setEvmproviders(
  providerInstance: EVMProvider,
  globalObject = window
): void {
  globalObject.evmproviders = globalObject.evmproviders || {};
  globalObject.evmproviders.core = providerInstance;

  globalObject.dispatchEvent(new Event('evmproviders#initialized'));
}

function announceWalletProvider(
  providerInstance: EVMProvider,
  globalObject = window
): void {
  const announceEvent = new CustomEvent<EIP6963ProviderDetail>(
    EventNames.EIP6963_ANNOUNCE_PROVIDER,
    {
      detail: Object.freeze({
        info: { ...providerInstance.info },
        provider: providerInstance,
      }),
    }
  );

  // The Wallet dispatches an announce event which is heard by
  // the DApp code that had run earlier
  globalObject.dispatchEvent(announceEvent);

  // The Wallet listens to the request events which may be
  // dispatched later and re-dispatches the `EIP6963AnnounceProviderEvent`
  globalObject.addEventListener(EventNames.EIP6963_REQUEST_PROVIDER, () => {
    globalObject.dispatchEvent(announceEvent);
  });
}

function announceChainAgnosticProvider(
  providerInstance: ChainAgnosticProvider,
  globalObject = window
): void {
  const announceEvent = new CustomEvent<{ provider: ChainAgnosticProvider }>(
    EventNames.CORE_WALLET_ANNOUNCE_PROVIDER,
    {
      detail: Object.freeze({
        provider: providerInstance,
      }),
    }
  );

  // The Wallet dispatches an announce event which is heard by
  // the DApp code that had run earlier
  globalObject.dispatchEvent(announceEvent);

  // The Wallet listens to the request events which may be
  // dispatched later and re-dispatches the `EIP6963AnnounceProviderEvent`
  globalObject.addEventListener(EventNames.CORE_WALLET_REQUEST_PROVIDER, () => {
    globalObject.dispatchEvent(announceEvent);
  });
}
