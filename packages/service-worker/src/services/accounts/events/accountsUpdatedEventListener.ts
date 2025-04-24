import { Accounts, AccountsEvents, ExtensionConnectionEvent } from '@core/types';

export function accountsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Accounts>,
) {
  return evt.name === AccountsEvents.ACCOUNTS_UPDATED;
}
