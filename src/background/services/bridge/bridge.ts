import { BehaviorSubject } from 'rxjs';
import { BridgeState } from './models';

export const defaultBridgeState: BridgeState = {
  bridgeTransactions: {},
};

export const bridge$ = new BehaviorSubject<BridgeState>(defaultBridgeState);
