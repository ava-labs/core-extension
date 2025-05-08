import {
  BalanceServiceEvents,
  BalancesInfo,
  ExtensionConnectionEvent,
} from '@core/types';

export function isBalancesUpdatedEvent(
  evt: ExtensionConnectionEvent<BalancesInfo>,
) {
  return evt.name === BalanceServiceEvents.UPDATED;
}
