import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { bridge$ } from '../bridge';

export async function getBridgeTransactions(
  request: ExtensionConnectionMessage
) {
  const bridge = await firstValueFrom(bridge$);

  return {
    ...request,
    result: bridge,
  };
}

export const GetBridgeTransactionsStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.BRIDGE_TRANSACTIONS_GET, getBridgeTransactions];
