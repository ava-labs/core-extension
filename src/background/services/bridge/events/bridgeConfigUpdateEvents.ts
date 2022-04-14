import { map } from 'rxjs';
import { BridgeEvents } from './models';
import { BridgeConfig } from '@avalabs/bridge-sdk';
import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { bridgeConfig$ } from '../bridgeConfig';

export function bridgeConfigUpdateEvents() {
  return bridgeConfig$.pipe(
    map((config) => {
      return {
        name: BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT,
        value: config,
      };
    })
  );
}

export function isBridgeConfigUpdateEventListener(
  evt: ExtensionConnectionEvent<BridgeConfig>
) {
  return evt?.name === BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT;
}
