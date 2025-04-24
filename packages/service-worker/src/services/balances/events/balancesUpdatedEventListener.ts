import { ExtensionConnectionEvent } from '../../../connections/models';
import { BalanceServiceEvents } from '@core/types/src/models';
import { BalancesInfo } from './balancesUpdatedEvent';

export function balancesUpdatedEventListener(
  evt: ExtensionConnectionEvent<BalancesInfo>,
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
