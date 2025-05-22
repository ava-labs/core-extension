import {
  BalanceServiceEvents,
  BalancesInfo,
  ExtensionConnectionEvent,
} from '@core/types';

export function isBalancesUpdatedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<BalancesInfo> {
  return evt.name === BalanceServiceEvents.UPDATED;
}
