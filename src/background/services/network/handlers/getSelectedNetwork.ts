import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { network$ } from '../network';

export async function getSelectedNetwork(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(network$);

  return {
    ...request,
    result,
  };
}

export const GetNetworkRequest: [ExtensionRequest, ConnectionRequestHandler] = [
  ExtensionRequest.NETWORK_GET_SELECTED,
  getSelectedNetwork,
];
