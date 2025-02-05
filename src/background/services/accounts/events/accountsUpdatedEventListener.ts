import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { Accounts } from '../models';
import { AccountsEvents } from '../models';

export function accountsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Accounts>,
) {
  return evt.name === AccountsEvents.ACCOUNTS_UPDATED;
}
