import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { TokenWithBalance, BalanceServiceEvents } from '../models';

export function balancesUpdatedEventListener(
  evt: ExtensionConnectionEvent<TokenWithBalance[]>
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
