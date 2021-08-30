import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { network$ } from '../network';
import { supportedNetworks } from '../models';
import { saveNetworkToStorage } from '../storage';

export async function setSelectedNetwork(request: ExtensionConnectionMessage) {
  const { params } = request;
  const networkName = params?.pop();

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

  network$.next(selectedNetwork);
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
