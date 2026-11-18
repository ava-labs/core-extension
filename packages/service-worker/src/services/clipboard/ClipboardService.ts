import {
  CLIPBOARD_CLEAR_ALARM_PREFIX,
  CLIPBOARD_SECRET_CLEAR_DELAY_MS,
  ClipboardClearResult,
  isSha256Hex,
  OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE,
  OffscreenClearClipboardMessage,
} from '@core/types';
import { singleton } from 'tsyringe';

export const OFFSCREEN_MESSAGE_MAX_ATTEMPTS = 10;
export const OFFSCREEN_MESSAGE_RETRY_DELAY_MS = 500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Clears secrets (recovery phrase / private key) from the clipboard after
 * {@link CLIPBOARD_SECRET_CLEAR_DELAY_MS}, even if the page that copied them has
 * been closed in the meantime (WSR-PHYS-001).
 *
 * The page sends only the SHA-256 of the secret. It is carried in the alarm
 * name, so nothing has to be kept in memory or storage across service worker
 * restarts, and the plaintext secret never reaches the service worker. When
 * the alarm fires, the offscreen document (which can access the clipboard)
 * clears it if it still holds the secret.
 */
@singleton()
export class ClipboardService {
  constructor() {
    this.onAlarm = this.onAlarm.bind(this);
  }

  /**
   * Must be called synchronously on service worker startup so the alarm that
   * woke the worker is delivered.
   */
  activate() {
    chrome.alarms.onAlarm.addListener(this.onAlarm);
  }

  async scheduleSecretClear(
    hash: string,
    delayMs: number = CLIPBOARD_SECRET_CLEAR_DELAY_MS,
  ) {
    if (!isSha256Hex(hash)) {
      throw new Error('Invalid clipboard secret hash');
    }

    await chrome.alarms.create(`${CLIPBOARD_CLEAR_ALARM_PREFIX}${hash}`, {
      when: Date.now() + Math.min(delayMs, CLIPBOARD_SECRET_CLEAR_DELAY_MS),
    });
  }

  async onAlarm(
    alarm: chrome.alarms.Alarm,
  ): Promise<ClipboardClearResult | undefined> {
    if (!alarm.name.startsWith(CLIPBOARD_CLEAR_ALARM_PREFIX)) {
      return;
    }

    const hash = alarm.name.slice(CLIPBOARD_CLEAR_ALARM_PREFIX.length);
    if (!isSha256Hex(hash)) {
      return;
    }

    return this.#requestOffscreenClear(hash);
  }

  async #requestOffscreenClear(
    hash: string,
  ): Promise<ClipboardClearResult | undefined> {
    const message: OffscreenClearClipboardMessage = {
      target: 'offscreen',
      type: OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE,
      hash,
    };

    // The alarm may have just woken the service worker, in which case the
    // offscreen document is being (re)created by BackgroundRuntime and is not
    // listening yet. Retry for a few seconds.
    for (
      let attempt = 1;
      attempt <= OFFSCREEN_MESSAGE_MAX_ATTEMPTS;
      attempt++
    ) {
      try {
        const result = (await chrome.runtime.sendMessage(message)) as
          | ClipboardClearResult
          | undefined;
        if (result) {
          return result;
        }
      } catch {
        // "Receiving end does not exist": offscreen document not ready yet.
      }

      if (attempt < OFFSCREEN_MESSAGE_MAX_ATTEMPTS) {
        await wait(OFFSCREEN_MESSAGE_RETRY_DELAY_MS);
      }
    }

    return undefined;
  }
}
