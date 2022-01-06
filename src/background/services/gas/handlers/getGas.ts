import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { gasPrice$ } from '../gas';

export async function getGas(request: ExtensionConnectionMessage) {
  const gasPrice = await firstValueFrom(gasPrice$);

  return {
    ...request,
    result: gasPrice,
  };
}

export const GetGasRequest: [ExtensionRequest, ConnectionRequestHandler] = [
  ExtensionRequest.GAS_GET,
  getGas,
];
