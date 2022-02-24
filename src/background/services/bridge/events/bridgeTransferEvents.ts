import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { map } from 'rxjs';
import { BridgeEvents, TransferEvent } from '../models';
import { transferEvent$ } from '../transferEvent';

export function bridgeTransferEvent() {
  return transferEvent$.pipe(
    map((status) => {
      return {
        name: BridgeEvents.BRIDGE_TRANSFER_EVENT,
        value: status,
      };
    })
  );
}

export function isBridgeTransferEventListener(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<TransferEvent> {
  return evt?.name === BridgeEvents.BRIDGE_TRANSFER_EVENT;
}
