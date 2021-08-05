import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { ActiveNetwork, supportedNetworks } from './models';
import { getNetworkFromStorage, saveNetworkToStorage } from './storage';
import { Network } from '@avalabs/avalanche-wallet-sdk';
import { formatAndLog } from '@src/background/utils/logging';
import { map, Subject, concat, from, tap, shareReplay } from 'rxjs';
import { resolve } from '@src/utils/promiseResolver';

const networkUpdates = new Subject<ActiveNetwork>();
export function listenForNetworkUpdates() {
  return networkUpdates.asObservable();
}

export const network = concat(
  from(getNetworkFromStorage()),
  networkUpdates
).pipe(shareReplay());

export async function getSelectedNetwork(request: ExtensionConnectionMessage) {
  const result = await getNetworkFromStorage();

  return {
    ...request,
    result,
  };
}

export async function setSelectedNetwork(request: ExtensionConnectionMessage) {
  const { params } = request;
  const networkName = params?.pop();

  if (!networkName) {
    return {
      ...request,
      error: new Error('network name missing in params'),
    };
  }

  const selectedNetwork = supportedNetworks.get(networkName);

  if (!selectedNetwork) {
    return {
      ...request,
      error: new Error('selected network not supported'),
    };
  }

  networkUpdates.next(selectedNetwork);
  const [_, err] = await resolve(saveNetworkToStorage(selectedNetwork));

  return {
    ...request,
    result: 'success',
  };
}

const NETWORK_UPDATE_EVENT = 'network-updated';
export function networkUpdateEvents() {
  return networkUpdates.pipe(
    map((network) => {
      return {
        name: NETWORK_UPDATE_EVENT,
        value: network,
      };
    })
  );
}

export function networkUpdatedEventListener(
  evt: ExtensionConnectionEvent<ActiveNetwork>
) {
  return evt.name === NETWORK_UPDATE_EVENT;
}

network.subscribe((selectedNetwork) => {
  Network.setNetwork(selectedNetwork.config);
  formatAndLog('network sdk updated', selectedNetwork);
});
