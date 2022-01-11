import { browser } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { CONTENT_SCRIPT, EXTENSION_SCRIPT } from './common';
import { providerConnection } from './background/connections/dAppConnection/providerConnection';
import { extensionConnection } from './background/connections/extensionConnection/extensionConnection';
import '@src/background/services/state';
import { ContextContainer } from './hooks/useIsSpecificContextContainer';
import { activateServices } from '@avalabs/wallet-react-components';
import { lockWalletFromSettings } from './background/services/settings/handlers/lockWallet';
import { ExtensionRequest } from './background/connections/models';

/**
 * This activates all of the services in the wallet react components SDK
 */
activateServices();

/**
 * If they just install then they need to onboard and we force them
 * fullscreen
 */
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: ContextContainer.HOME });
  }
});

browser.contextMenus.removeAll().then(() => {
  // Creating the "Lock wallet" extension menu item
  browser.contextMenus.create({
    type: 'normal',
    id: 'lock-wallet',
    title: '🔒 Lock wallet',
    contexts: ['browser_action'],
    onclick: (info, tab) => {
      lockWalletFromSettings({
        id: tab.id?.toString() || '',
        method: ExtensionRequest.SETTINGS_LOCK_WALLET,
      });
    },
  });
});

browser.runtime.onConnect.addListener((connection) => {
  /**
   * we only want connection from the parent app, that is frameId = 0
   *
   * If it doesnt have a frameid then its the extension popup itself
   */
  if (connection.sender?.frameId && connection.sender?.frameId !== 0) {
    return;
  }

  if (connection.sender?.id === extension.runtime.id) {
    if (connection.name === CONTENT_SCRIPT) {
      providerConnection(connection);
    } else if (connection.name === EXTENSION_SCRIPT) {
      extensionConnection(connection);
    }
  }
});
