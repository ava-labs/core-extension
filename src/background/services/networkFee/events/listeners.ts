import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GasPrice, NetworkFeeEvents } from '../models';

export function networkFeeUpdatedEventListener(
  evt: ExtensionConnectionEvent<GasPrice>
) {
  return evt.name === NetworkFeeEvents.NETWORK_FEE_UPDATED;
}
