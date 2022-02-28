import { filter, map, OperatorFunction } from 'rxjs';
import { bridge$ } from '../bridge';
import { BridgeState } from '../models';
import { BridgeEvents } from './models';

export function bridgeTransactionsUpdatedEvent() {
  return bridge$.pipe(
    filter((value) => value !== undefined) as OperatorFunction<
      BridgeState | undefined,
      BridgeState
    >,
    map((value) => ({
      name: BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED,
      value,
    }))
  );
}
