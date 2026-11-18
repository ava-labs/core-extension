/**
 * Secrets (recovery phrase, private key) copied to the clipboard are cleared
 * after this delay (WSR-PHYS-001 requires <= 1 minute of exposure).
 */
export const CLIPBOARD_SECRET_CLEAR_DELAY_MS = 60 * 1000;

/**
 * Alarm names are `${CLIPBOARD_CLEAR_ALARM_PREFIX}${sha256HexOfSecret}`. Using
 * the alarm name to carry the hash keeps the service worker stateless (it may
 * restart before the alarm fires) and means the plaintext secret never leaves
 * the page that copied it.
 */
export const CLIPBOARD_CLEAR_ALARM_PREFIX = 'clear-clipboard:';

export const OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE = 'offscreen:clear-clipboard';

export type OffscreenClearClipboardMessage = {
  target: 'offscreen';
  type: typeof OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE;
  hash: string;
};

export enum ClipboardClearResult {
  /** Clipboard still contained the secret and was cleared. */
  Cleared = 'cleared',
  /** Clipboard could not be read, so it was cleared to be safe. */
  ClearedUnverified = 'cleared-unverified',
  /** Clipboard content changed since the copy; left untouched. */
  Changed = 'changed',
  /** Clearing failed. */
  Failed = 'failed',
}

export const isSha256Hex = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
