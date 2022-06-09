import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { BalanceServiceEvents, SerializedBalances } from '../models';

export function balancesUpdatedEventListener(
  evt: ExtensionConnectionEvent<SerializedBalances>
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
