import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { Account, AccountsEvents } from '../models';

export function accountsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Account[]>
) {
  return evt.name === AccountsEvents.ACCOUNTS_UPDATED;
}
