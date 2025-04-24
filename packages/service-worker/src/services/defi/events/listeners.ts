import {
  DefiPortfolioUpdatedEvent,
  DefiServiceEvents,
	ExtensionConnectionEvent,
} from '@core/types';

export function defiPortfolioUpdatedEventListener(
  evt: ExtensionConnectionEvent<DefiPortfolioUpdatedEvent>,
) {
  return evt.name === DefiServiceEvents.PortfolioUpdated;
}
