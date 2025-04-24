import {
  BalanceServiceEvents,
  BalancesInfo,
  ExtensionConnectionEvent,
} from '@core/types';

export function balancesUpdatedEventListener(
  evt: ExtensionConnectionEvent<BalancesInfo>,
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
