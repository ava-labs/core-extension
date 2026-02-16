import { EVMProvider } from '@avalabs/evm-module/dist/provider';
import {
  initialize as initializeSolanaProvider,
  SolanaWalletProvider,
} from '@avalabs/svm-module/dist/provider';
import type { AbstractConnection } from '@core/messaging';

import { ChainAgnosticProvider } from './ChainAgnosticProvider';
import { createMultiWalletProxy } from './MultiWalletProviderProxy';
import { EventNames, type EIP6963ProviderDetail } from './models';

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
  globalObject = window,
): EVMProvider {
  const chainAgnosticProvider = new Proxy(
    new ChainAgnosticProvider(connection),
    {
      deleteProperty: () => true,
    },
  );

  const evmProvider = new Proxy(
    new EVMProvider({
      maxListeners,
      // Core Web needs to know which extension version it's working with
      // For local (dev) builds, CORE_EXTENSION_VERSION is 0.0.0
      // For release builds (alpha or production), it's replaced by semantic-release to the actual version number
      walletVersion: CORE_EXTENSION_VERSION,
      info: {
        name: EVM_PROVIDER_INFO_NAME,
        uuid: EVM_PROVIDER_INFO_UUID,
        icon: EVM_PROVIDER_INFO_ICON,
        description: EVM_PROVIDER_INFO_DESCRIPTION,
        rdns: EVM_PROVIDER_INFO_RDNS,
      },
    }),
    {
      // some common libraries, e.g. web3@1.x, mess with our API
      deleteProperty: () => true,
    },
  );
  const multiWalletProxy = createMultiWalletProxy(evmProvider);

  globalObject.addEventListener('eip6963:announceProvider', (event: any) => {
    multiWalletProxy.addProvider(
      new Proxy(
        {
          info: { ...event.detail.info },
          ...event.detail.provider,
        },
        {
          deleteProperty: () => true,
          set: () => true,
        },
      ),
    );
  });

  setGlobalProvider(evmProvider, globalObject, multiWalletProxy);
  setAvalancheGlobalProvider(evmProvider, globalObject);
  announceWalletProvider(evmProvider, globalObject);
  announceChainAgnosticProvider(chainAgnosticProvider, globalObject);

  try {
    initializeSolanaProvider(
      new SolanaWalletProvider(chainAgnosticProvider, {
        icon: EVM_PROVIDER_INFO_ICON,
        name: EVM_PROVIDER_INFO_NAME,
        version: CORE_EXTENSION_VERSION,
      }),
    );
  } catch {
    // Do nothing
  }

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
  globalObject = window,
  multiWalletProxy,
): void {
  try {
    Object.defineProperty(globalObject, 'ethereum', {
      get: () => {
        return multiWalletProxy;
      },
      // in case a wallet tries to overwrite us lets add them to the list
      set: () => {
        return multiWalletProxy;
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

    try {
      // try to set the providerInstance in case it's a proxy like we are
      globalObject.ethereum = providerInstance;
    } catch (fallbackError) {
      console.error(
        'Cannot set Core window.ethereum provider as fallback',
        fallbackError,
      );
    }
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
  globalObject = window,
): void {
  Object.defineProperty(globalObject, 'avalanche', {
    value: providerInstance,
    writable: false,
  });
  globalObject.dispatchEvent(new Event('avalanche#initialized'));
}

function announceWalletProvider(
  providerInstance: EVMProvider,
  globalObject = window,
): void {
  const announceEvent = new CustomEvent<EIP6963ProviderDetail>(
    EventNames.EIP6963_ANNOUNCE_PROVIDER,
    {
      detail: Object.freeze({
        info: { ...providerInstance.info },
        provider: providerInstance,
      }),
    },
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
  globalObject = window,
): void {
  const announceEvent = new CustomEvent<{ provider: ChainAgnosticProvider }>(
    EventNames.CORE_WALLET_ANNOUNCE_PROVIDER,
    {
      detail: Object.freeze({
        provider: providerInstance,
      }),
    },
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
