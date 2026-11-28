import {
  clearClipboardIfMatches,
  readClipboardText,
  writeClipboardText,
} from '@core/common';
import { ClipboardClearSecretEventValue, isSha256Hex } from '@core/types';

/**
 * Handles the service worker's ClipboardEvents.CLEAR_SECRET event (see
 * ClipboardService): clears the clipboard if it still holds the secret.
 */
export const clearCopiedSecret = async (value: unknown) => {
  const hash = (value as Partial<ClipboardClearSecretEventValue> | undefined)
    ?.hash;
  if (!isSha256Hex(hash)) {
    return;
  }

  return clearClipboardIfMatches(hash, {
    read: () => readClipboardText(document),
    write: (text) => writeClipboardText(text, document),
  });
};
