import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { DefiPortfolioUpdatedEvent } from '../models';
import { DefiServiceEvents } from '../models';

export function defiPortfolioUpdatedEventListener(
  evt: ExtensionConnectionEvent<DefiPortfolioUpdatedEvent>,
) {
  return evt.name === DefiServiceEvents.PortfolioUpdated;
}
