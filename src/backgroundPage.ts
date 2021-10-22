import { browser } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { CONTENT_SCRIPT, EXTENSION_SCRIPT } from './common';
import { providerConnection } from './background/connections/dAppConnection/providerConnection';
import { extensionConnection } from './background/connections/extensionConnection/extensionConnection';
import '@src/background/services/state';
/**
 * If they just install then they need to onboard and we force them
 * fullscreen
 */
browser.runtime.onInstalled.addListener(() => {
  /**
   * When we start finishing home view we can undo this
   * while our focus is on mobile we need to enforce a
   * mobile first view
   *
   * [TODO]: put home view back
   */
  browser.tabs.create({ url: '/popup.html' });
  // browser.tabs.create({ url: '/home.html' });
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
