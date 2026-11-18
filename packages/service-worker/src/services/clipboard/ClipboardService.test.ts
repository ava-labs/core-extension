import {
  CLIPBOARD_CLEAR_ALARM_PREFIX,
  CLIPBOARD_SECRET_CLEAR_DELAY_MS,
  ClipboardClearResult,
  OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE,
} from '@core/types';
import {
  ClipboardService,
  OFFSCREEN_MESSAGE_MAX_ATTEMPTS,
  OFFSCREEN_MESSAGE_RETRY_DELAY_MS,
} from './ClipboardService';

const HASH = 'ab'.repeat(32);

describe('ClipboardService', () => {
  const alarms = {
    create: jest.fn(),
    onAlarm: { addListener: jest.fn() },
  };
  const runtime = { sendMessage: jest.fn() };
  let service: ClipboardService;

  beforeEach(() => {
    (global as any).chrome = { alarms, runtime };
    jest.useFakeTimers({ now: 1_000_000 });
    service = new ClipboardService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const alarm = (name: string) =>
    ({ name, scheduledTime: Date.now() }) as chrome.alarms.Alarm;

  describe('activate', () => {
    it('registers the alarm listener', () => {
      service.activate();

      expect(alarms.onAlarm.addListener).toHaveBeenCalledWith(service.onAlarm);
    });
  });

  describe('scheduleSecretClear', () => {
    it('creates an alarm carrying the hash that fires after 60 seconds', async () => {
      await service.scheduleSecretClear(HASH);

      expect(alarms.create).toHaveBeenCalledWith(
        `${CLIPBOARD_CLEAR_ALARM_PREFIX}${HASH}`,
        { when: 1_000_000 + CLIPBOARD_SECRET_CLEAR_DELAY_MS },
      );
    });

    it('caps the delay at 60 seconds', async () => {
      await service.scheduleSecretClear(HASH, 10 * 60 * 1000);

      expect(alarms.create).toHaveBeenCalledWith(expect.any(String), {
        when: 1_000_000 + CLIPBOARD_SECRET_CLEAR_DELAY_MS,
      });
    });

    it.each(['', 'not-a-hash', 'AB'.repeat(32), 'ab'.repeat(33)])(
      'rejects invalid hash %p',
      async (hash) => {
        await expect(service.scheduleSecretClear(hash)).rejects.toThrow(
          'Invalid clipboard secret hash',
        );
        expect(alarms.create).not.toHaveBeenCalled();
      },
    );
  });

  describe('onAlarm', () => {
    it('ignores unrelated alarms', async () => {
      await expect(service.onAlarm(alarm('auto-lock'))).resolves.toBe(
        undefined,
      );
      expect(runtime.sendMessage).not.toHaveBeenCalled();
    });

    it('ignores clipboard alarms with a malformed hash', async () => {
      await service.onAlarm(alarm(`${CLIPBOARD_CLEAR_ALARM_PREFIX}oops`));

      expect(runtime.sendMessage).not.toHaveBeenCalled();
    });

    it('asks the offscreen document to clear the clipboard if it still holds the secret', async () => {
      runtime.sendMessage.mockResolvedValue(ClipboardClearResult.Cleared);

      await expect(
        service.onAlarm(alarm(`${CLIPBOARD_CLEAR_ALARM_PREFIX}${HASH}`)),
      ).resolves.toBe(ClipboardClearResult.Cleared);

      expect(runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(runtime.sendMessage).toHaveBeenCalledWith({
        target: 'offscreen',
        type: OFFSCREEN_CLEAR_CLIPBOARD_MESSAGE,
        hash: HASH,
      });
    });

    it('retries while the offscreen document is not ready yet', async () => {
      runtime.sendMessage
        .mockRejectedValueOnce(
          new Error(
            'Could not establish connection. Receiving end does not exist.',
          ),
        )
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(ClipboardClearResult.Changed);

      const promise = service.onAlarm(
        alarm(`${CLIPBOARD_CLEAR_ALARM_PREFIX}${HASH}`),
      );
      await jest.advanceTimersByTimeAsync(OFFSCREEN_MESSAGE_RETRY_DELAY_MS * 2);

      await expect(promise).resolves.toBe(ClipboardClearResult.Changed);
      expect(runtime.sendMessage).toHaveBeenCalledTimes(3);
    });

    it('gives up after the maximum number of attempts', async () => {
      runtime.sendMessage.mockRejectedValue(new Error('no receiver'));

      const promise = service.onAlarm(
        alarm(`${CLIPBOARD_CLEAR_ALARM_PREFIX}${HASH}`),
      );
      await jest.advanceTimersByTimeAsync(
        OFFSCREEN_MESSAGE_RETRY_DELAY_MS * OFFSCREEN_MESSAGE_MAX_ATTEMPTS,
      );

      await expect(promise).resolves.toBeUndefined();
      expect(runtime.sendMessage).toHaveBeenCalledTimes(
        OFFSCREEN_MESSAGE_MAX_ATTEMPTS,
      );
    });
  });
});
