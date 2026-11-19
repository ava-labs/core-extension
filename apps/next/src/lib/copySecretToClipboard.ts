import {
  clearClipboardIfMatches,
  readClipboardText,
  sha256Hex,
  writeClipboardText,
} from '@core/common';
import { CLIPBOARD_SECRET_CLEAR_DELAY_MS } from '@core/types';

type SecretClipboard = {
  write: (text: string) => Promise<void>;
  /** Returns `null` when the clipboard cannot be read. */
  read: () => Promise<string | null> | string | null;
  clear: () => Promise<boolean> | boolean;
};

export const defaultSecretClipboard: SecretClipboard = {
  write: (text) => navigator.clipboard.writeText(text),
  read: () => readClipboardText(document),
  clear: async () => {
    try {
      await navigator.clipboard.writeText('');
      return true;
    } catch {
      // navigator.clipboard requires focus, which the page may have lost.
      return writeClipboardText('', document);
    }
  },
};

type CopySecretOptions = {
  /** Shows the "will be cleared" warning to the user. */
  notify: () => void;
  /**
   * Asks the service worker to clear the clipboard if this page is closed
   * before the in-page timer fires. Receives the SHA-256 of the secret only.
   */
  scheduleBackgroundClear: (hash: string) => Promise<unknown>;
  clipboard?: SecretClipboard;
  delayMs?: number;
};

/**
 * Copies a secret (recovery phrase, private key) to the clipboard, warns the
 * user, and clears the clipboard after at most
 * {@link CLIPBOARD_SECRET_CLEAR_DELAY_MS} if it still holds the secret
 * (WSR-PHYS-001).
 *
 * Clearing happens twice for robustness: an in-page timer handles the common
 * case, and a service worker alarm (via the offscreen document) handles the
 * popup being closed before the timer fires.
 */
export const copySecretToClipboard = async (
  secret: string,
  {
    notify,
    scheduleBackgroundClear,
    clipboard = defaultSecretClipboard,
    delayMs = CLIPBOARD_SECRET_CLEAR_DELAY_MS,
  }: CopySecretOptions,
): Promise<void> => {
  await clipboard.write(secret);
  notify();

  const hash = sha256Hex(secret);
  const clearDelay = Math.min(delayMs, CLIPBOARD_SECRET_CLEAR_DELAY_MS);

  setTimeout(() => {
    void clearClipboardIfMatches(hash, {
      read: clipboard.read,
      write: () => clipboard.clear(),
    });
  }, clearDelay);

  try {
    await scheduleBackgroundClear(hash);
  } catch {
    // The in-page timer still covers the case where the page stays open.
  }
};
