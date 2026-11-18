import { sha256Hex } from '@core/common';
import { CLIPBOARD_SECRET_CLEAR_DELAY_MS } from '@core/types';
import { copySecretToClipboard } from './copySecretToClipboard';

const SECRET = 'test test test test test test test test test test test junk';

// Hashing uses WebCrypto, which resolves outside the microtask queue, so give
// the event loop a few real turns.
const realSetTimeout = global.setTimeout;
const flushPromises = async () => {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => realSetTimeout(resolve, 0));
  }
};

describe('copySecretToClipboard', () => {
  let clipboardContent: string | null;
  let clipboard: {
    write: jest.Mock;
    read: jest.Mock;
    clear: jest.Mock;
  };
  let notify: jest.Mock;
  let scheduleBackgroundClear: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    clipboardContent = null;
    clipboard = {
      write: jest.fn(async (text: string) => {
        clipboardContent = text;
      }),
      read: jest.fn(() => clipboardContent),
      clear: jest.fn(() => {
        clipboardContent = '';
        return true;
      }),
    };
    notify = jest.fn();
    scheduleBackgroundClear = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const copy = (delayMs?: number) =>
    copySecretToClipboard(SECRET, {
      notify,
      scheduleBackgroundClear,
      clipboard,
      delayMs,
    });

  it('writes the secret to the clipboard and shows the warning', async () => {
    await copy();

    expect(clipboard.write).toHaveBeenCalledWith(SECRET);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('schedules a background clear with the hash, never the plaintext secret', async () => {
    await copy();

    expect(scheduleBackgroundClear).toHaveBeenCalledWith(
      await sha256Hex(SECRET),
    );
    expect(JSON.stringify(scheduleBackgroundClear.mock.calls)).not.toContain(
      'junk',
    );
  });

  it('clears the clipboard after 60 seconds when it still holds the secret', async () => {
    await copy();

    jest.advanceTimersByTime(CLIPBOARD_SECRET_CLEAR_DELAY_MS - 1);
    await flushPromises();
    expect(clipboard.clear).not.toHaveBeenCalled();
    expect(clipboardContent).toBe(SECRET);

    jest.advanceTimersByTime(1);
    await flushPromises();
    expect(clipboard.clear).toHaveBeenCalledTimes(1);
    expect(clipboardContent).toBe('');
  });

  it('does not clear the clipboard if its content changed', async () => {
    await copy();
    clipboardContent = 'something the user copied later';

    jest.advanceTimersByTime(CLIPBOARD_SECRET_CLEAR_DELAY_MS);
    await flushPromises();

    expect(clipboard.clear).not.toHaveBeenCalled();
    expect(clipboardContent).toBe('something the user copied later');
  });

  it('clears anyway when the clipboard cannot be read', async () => {
    await copy();
    clipboard.read.mockReturnValue(null);

    jest.advanceTimersByTime(CLIPBOARD_SECRET_CLEAR_DELAY_MS);
    await flushPromises();

    expect(clipboard.clear).toHaveBeenCalledTimes(1);
  });

  it('never waits longer than 60 seconds', async () => {
    await copy(5 * 60 * 1000);

    jest.advanceTimersByTime(CLIPBOARD_SECRET_CLEAR_DELAY_MS);
    await flushPromises();

    expect(clipboard.clear).toHaveBeenCalledTimes(1);
  });

  it('still clears in-page when scheduling the background clear fails', async () => {
    scheduleBackgroundClear.mockRejectedValue(new Error('disconnected'));

    await expect(copy()).resolves.toBeUndefined();

    jest.advanceTimersByTime(CLIPBOARD_SECRET_CLEAR_DELAY_MS);
    await flushPromises();
    expect(clipboard.clear).toHaveBeenCalledTimes(1);
  });

  it('does not warn or schedule anything when copying fails', async () => {
    clipboard.write.mockRejectedValue(new Error('denied'));

    await expect(copy()).rejects.toThrow('denied');

    expect(notify).not.toHaveBeenCalled();
    expect(scheduleBackgroundClear).not.toHaveBeenCalled();
  });
});
