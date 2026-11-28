/**
 * Secrets (recovery phrase, private key) copied to the clipboard are cleared
 * after this delay (WSR-PHYS-001 requires <= 1 minute of exposure).
 */
export const CLIPBOARD_SECRET_CLEAR_DELAY_MS = 60 * 1000;

/**
 * Sent from the service worker to the offscreen document over the existing
 * offscreen connection when a clipboard-clear alarm fires.
 */
export enum ClipboardEvents {
  CLEAR_SECRET = 'Clipboard: CLEAR_SECRET',
}

export type ClipboardClearSecretEventValue = {
  /** SHA-256 (hex) of the copied secret. */
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
