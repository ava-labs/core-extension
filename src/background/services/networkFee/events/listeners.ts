import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { NetworkFee, NetworkFeeEvents } from '../models';

export function networkFeeUpdatedEventListener(
  evt: ExtensionConnectionEvent<NetworkFee>
) {
  return evt.name === NetworkFeeEvents.NETWORK_FEE_UPDATED;
}
