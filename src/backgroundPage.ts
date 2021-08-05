import { browser } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { CONTENT_SCRIPT, EXTENSION_SCRIPT } from './common';
import { providerConnection } from './background/connections/providerConnection';
import { extensionConnection } from './background/connections/extensionConnection';
import './background/services/wallet/init';

/**
 * If they just install then they need to onboard and we force them
 * fullscreen
 */
// browser.runtime.onInstalled.addListener(() => {
//   browser.tabs.create({ url: '/home.html' });
// });

browser.runtime.onConnect.addListener((connection) => {
  console.log('connecting: ', connection);

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
