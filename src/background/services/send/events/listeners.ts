import { SendSubmitResponse } from '@avalabs/wallet-react-components';
import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { SendEvent } from './models';

export function sendTxUpdatedEventListener(
  evt: ExtensionConnectionEvent<SendSubmitResponse>
) {
  return evt.name === SendEvent.TX_DETAILS;
}
