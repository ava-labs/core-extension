import { ExtensionConnectionEvent } from '../../../connections/models';
import { DefiPortfolioUpdatedEvent, DefiServiceEvents } from '../models';

export function defiPortfolioUpdatedEventListener(
  evt: ExtensionConnectionEvent<DefiPortfolioUpdatedEvent>,
) {
  return evt.name === DefiServiceEvents.PortfolioUpdated;
}
