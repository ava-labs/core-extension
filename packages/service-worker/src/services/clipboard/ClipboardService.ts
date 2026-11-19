import {
  AlarmsEvents,
  CLIPBOARD_SECRET_CLEAR_DELAY_MS,
  ClipboardClearSecretEventValue,
  ClipboardEvents,
  ExtensionConnectionEvent,
  isSha256Hex,
  OffscreenEventEmitter,
} from '@core/types';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';

type ClearSecretEvent =
  ExtensionConnectionEvent<ClipboardClearSecretEventValue>;

/**
 * Clears secrets (recovery phrase / private key) from the clipboard after
 * {@link CLIPBOARD_SECRET_CLEAR_DELAY_MS}, even if the page that copied them has
 * been closed in the meantime (WSR-PHYS-001).
 *
 * The page sends only the SHA-256 of the secret. It is carried in the alarm
 * name, so nothing has to be kept in storage across service worker restarts,
 * and the plaintext secret never reaches the service worker. When the alarm
 * fires, a {@link ClipboardEvents.CLEAR_SECRET} event is sent to the offscreen
 * document (which can access the clipboard) over the offscreen connection.
 *
 * Registered as an `OffscreenEventEmitter`. When the alarm wakes the service
 * worker, the offscreen document is still being recreated, so events are held
 * until the offscreen connection attaches its listener.
 */
@singleton()
export class ClipboardService implements OffscreenEventEmitter {
  #eventEmitter = new EventEmitter();
  #pending: ClearSecretEvent[] = [];

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

    await chrome.alarms.create(`${AlarmsEvents.CLEAR_CLIPBOARD}${hash}`, {
      when: Date.now() + Math.min(delayMs, CLIPBOARD_SECRET_CLEAR_DELAY_MS),
    });
  }

  onAlarm(alarm: chrome.alarms.Alarm) {
    if (!alarm.name.startsWith(AlarmsEvents.CLEAR_CLIPBOARD)) {
      return;
    }

    const hash = alarm.name.slice(AlarmsEvents.CLEAR_CLIPBOARD.length);
    if (!isSha256Hex(hash)) {
      return;
    }

    const event: ClearSecretEvent = {
      name: ClipboardEvents.CLEAR_SECRET,
      value: { hash },
    };

    if (this.#eventEmitter.listenerCount('update') === 0) {
      this.#pending.push(event);
      return;
    }

    this.#eventEmitter.emit('update', event);
  }

  addListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.#eventEmitter.on('update', handler);

    const pending = this.#pending;
    this.#pending = [];
    pending.forEach((event) => handler(event));
  }

  removeListener(handler: (event: ExtensionConnectionEvent) => void): void {
    this.#eventEmitter.off('update', handler);
  }
}
