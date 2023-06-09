import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { BalanceServiceEvents } from '../models';
import { BalancesInfo } from './balancesUpdatedEvent';

export function balancesUpdatedEventListener(
  evt: ExtensionConnectionEvent<BalancesInfo>
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
