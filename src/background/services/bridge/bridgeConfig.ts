import { BridgeConfig } from '@avalabs/bridge-sdk';
import { BehaviorSubject } from 'rxjs';

export const bridgeConfig$ = new BehaviorSubject<BridgeConfig>({});
