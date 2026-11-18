import {
  clearClipboardIfMatches,
  readClipboardText,
  writeClipboardText,
} from '@core/common';
import {
  isSha256Hex,
  OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE,
  OffscreenClearClipboardMessage,
} from '@core/types';
import browser from 'webextension-polyfill';

const isClearClipboardMessage = (
  message: unknown,
): message is OffscreenClearClipboardMessage =>
  typeof message === 'object' &&
  message !== null &&
  (message as OffscreenClearClipboardMessage).target === 'offscreen' &&
  (message as OffscreenClearClipboardMessage).type ===
    OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE &&
  isSha256Hex((message as OffscreenClearClipboardMessage).hash);

/**
 * Handles the service worker's request to clear a copied secret from the
 * clipboard (see ClipboardService). Only requests from this extension are
 * accepted.
 */
export const registerClipboardListener = () => {
  browser.runtime.onMessage.addListener((message: unknown, sender) => {
    if (sender.id !== browser.runtime.id || !isClearClipboardMessage(message)) {
      return undefined;
    }

    return clearClipboardIfMatches(message.hash, {
      read: () => readClipboardText(document),
      write: (text) => writeClipboardText(text, document),
    });
  });
};
