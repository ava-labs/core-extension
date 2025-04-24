import { ExtensionConnectionEvent } from '../../../connections/models';
import { DefiPortfolioUpdatedEvent, DefiServiceEvents } from '@core/types/src/models';

export function defiPortfolioUpdatedEventListener(
  evt: ExtensionConnectionEvent<DefiPortfolioUpdatedEvent>,
) {
  return evt.name === DefiServiceEvents.PortfolioUpdated;
}
