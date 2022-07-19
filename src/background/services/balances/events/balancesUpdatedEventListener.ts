import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { BalanceServiceEvents, Balances } from '../models';

export function balancesUpdatedEventListener(
  evt: ExtensionConnectionEvent<Balances>
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
