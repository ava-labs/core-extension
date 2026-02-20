import { ExtensionConnectionEvent, TrackedTransfers } from '@core/types';

export function isTransfersUpdatedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<TrackedTransfers> {
  return evt.name === 'tracked-transfers-updated';
}
