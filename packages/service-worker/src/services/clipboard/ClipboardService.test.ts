import {
  AlarmsEvents,
  CLIPBOARD_SECRET_CLEAR_DELAY_MS,
  ClipboardEvents,
} from '@core/types';
import { ClipboardService } from './ClipboardService';

const HASH = 'ab'.repeat(32);
const ALARM_NAME = `${AlarmsEvents.CLEAR_CLIPBOARD}${HASH}`;

describe('ClipboardService', () => {
  const alarms = {
    create: jest.fn(),
    onAlarm: { addListener: jest.fn() },
  };
  let service: ClipboardService;

  beforeEach(() => {
    jest.resetAllMocks();
    (global as any).chrome = { alarms };
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

      expect(alarms.create).toHaveBeenCalledWith(ALARM_NAME, {
        when: 1_000_000 + CLIPBOARD_SECRET_CLEAR_DELAY_MS,
      });
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
    const expectedEvent = {
      name: ClipboardEvents.CLEAR_SECRET,
      value: { hash: HASH },
    };

    it('ignores unrelated alarms', () => {
      const listener = jest.fn();
      service.addListener(listener);

      service.onAlarm(alarm(AlarmsEvents.AUTO_LOCK));

      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores clipboard alarms with a malformed hash', () => {
      const listener = jest.fn();
      service.addListener(listener);

      service.onAlarm(alarm(`${AlarmsEvents.CLEAR_CLIPBOARD}oops`));

      expect(listener).not.toHaveBeenCalled();
    });

    it('sends the clear event to the connected offscreen document', () => {
      const listener = jest.fn();
      service.addListener(listener);

      service.onAlarm(alarm(ALARM_NAME));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expectedEvent);
    });

    it('holds the event until the offscreen document connects', () => {
      service.onAlarm(alarm(ALARM_NAME));

      const listener = jest.fn();
      service.addListener(listener);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expectedEvent);

      // Delivered only once, not again to a later connection.
      const laterListener = jest.fn();
      service.removeListener(listener);
      service.addListener(laterListener);
      expect(laterListener).not.toHaveBeenCalled();
    });

    it('stops sending events to a removed listener', () => {
      const listener = jest.fn();
      service.addListener(listener);
      service.removeListener(listener);

      service.onAlarm(alarm(ALARM_NAME));

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
