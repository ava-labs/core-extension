import {
  DefiPortfolioUpdatedEvent,
  DefiServiceEvents,
  ExtensionConnectionEvent,
} from '@core/types';

export function defiPortfolioUpdatedEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<DefiPortfolioUpdatedEvent> {
  return evt.name === DefiServiceEvents.PortfolioUpdated;
}
