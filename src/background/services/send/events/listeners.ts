import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { SendEvent } from '../models';

export function sendTxUpdatedEventListener(evt: ExtensionConnectionEvent) {
  return evt.name === SendEvent.TX_DETAILS;
}
