import { ExtensionConnectionEvent, LedgerEvent } from '@core/types';
import {
  isLedgerDeviceRequestEvent,
  ledgerDiscoverTransportsEventListener,
} from './listeners';

const event = (name: string) => ({ name }) as ExtensionConnectionEvent;

describe('contexts/LedgerProvider/listeners', () => {
  it('matches only transport discovery events', () => {
    expect(
      ledgerDiscoverTransportsEventListener(
        event(LedgerEvent.DISCOVER_TRANSPORTS),
      ),
    ).toBe(true);
    expect(
      ledgerDiscoverTransportsEventListener(
        event(LedgerEvent.TRANSPORT_REQUEST),
      ),
    ).toBe(false);
  });

  it('matches only device request events', () => {
    expect(
      isLedgerDeviceRequestEvent(event(LedgerEvent.TRANSPORT_REQUEST)),
    ).toBe(true);
    expect(
      isLedgerDeviceRequestEvent(event(LedgerEvent.DISCOVER_TRANSPORTS)),
    ).toBe(false);
  });
});
