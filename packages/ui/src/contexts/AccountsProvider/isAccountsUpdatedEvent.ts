import {
  Accounts,
  AccountsEvents,
  ExtensionConnectionEvent,
} from '@core/types';

export function isAccountsUpdatedEvent(
  evt: ExtensionConnectionEvent<Accounts>,
) {
  return evt.name === AccountsEvents.ACCOUNTS_UPDATED;
}
