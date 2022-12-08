import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { Accounts, AccountsEvents } from '../models';

export function accountsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Accounts>
) {
  return evt.name === AccountsEvents.ACCOUNTS_UPDATED;
}
