import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { networkUpdates$ } from '@avalabs/wallet-react-components';
import { supportedNetworks } from '../models';
import { saveNetworkToStorage } from '../storage';

export async function setSelectedNetwork(request: ExtensionConnectionMessage) {
  const { params } = request;
  const [networkName] = params || [];

  if (!networkName) {
    return {
      ...request,
      error: 'network name missing in params',
    };
  }

  const selectedNetwork = supportedNetworks.get(networkName);

  if (!selectedNetwork) {
    return {
      ...request,
      error: 'selected network not supported',
    };
  }
  networkUpdates$.next(selectedNetwork);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, err] = await resolve(saveNetworkToStorage(selectedNetwork));

  return {
    ...request,
    result: 'success',
  };
}

export const SetNetworkRequest: [ExtensionRequest, ConnectionRequestHandler] = [
  ExtensionRequest.NETWORK_SET_SELECTED,
  setSelectedNetwork,
];
