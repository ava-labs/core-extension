import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { AccountsEvents } from './models';
import { Account } from '../models';

export function accountsUpdatedEventListener(
  evt: ExtensionConnectionEvent<Account[]>
) {
  return evt.name === AccountsEvents.ACCOUNTS_UPDATE_EVENT;
}
