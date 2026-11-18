import { ClipboardClearResult } from '@core/types';
import { sha256Hex } from './sha256Hex';

type ClipboardIO = {
  /** Returns the clipboard text, or `null` when it cannot be read. */
  read: () => Promise<string | null> | string | null;
  /** Writes text to the clipboard, returning `false` on failure. */
  write: (text: string) => Promise<boolean> | boolean;
};

/**
 * Clears the clipboard if it still holds the secret identified by
 * `expectedHash` (SHA-256 hex). If the clipboard was changed in the meantime
 * it is left alone. If it cannot be read (no `clipboardRead` permission), it
 * is cleared anyway: limiting secret exposure takes priority over preserving
 * whatever the user may have copied afterwards.
 */
export const clearClipboardIfMatches = async (
  expectedHash: string,
  { read, write }: ClipboardIO,
): Promise<ClipboardClearResult> => {
  let current: string | null;
  try {
    current = await read();
  } catch {
    current = null;
  }

  if (current !== null && (await sha256Hex(current)) !== expectedHash) {
    return ClipboardClearResult.Changed;
  }

  let written: boolean;
  try {
    written = await write('');
  } catch {
    written = false;
  }

  if (!written) {
    return ClipboardClearResult.Failed;
  }

  return current === null
    ? ClipboardClearResult.ClearedUnverified
    : ClipboardClearResult.Cleared;
};
