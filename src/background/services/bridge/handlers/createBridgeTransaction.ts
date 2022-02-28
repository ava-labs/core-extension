import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { bridge$ } from '../bridge';

export async function createBridgeTransaction(
  request: ExtensionConnectionMessage
) {
  const [bridgeTransaction] = request.params || [];

  const bridgeState = await firstValueFrom(bridge$);

  const newBridgeState = {
    ...bridgeState,
    bridgeTransactions: {
      ...bridgeState.bridgeTransactions,
      [bridgeTransaction.sourceTxHash]: {
        ...bridgeTransaction,
        createdAt:
          bridgeState.bridgeTransactions?.[bridgeTransaction.sourceTxHash]
            ?.createdAt || new Date(),
      },
    },
  };

  bridge$.next(newBridgeState);

  return {
    ...request,
    result: true,
  };
}

export const CreateBridgeTransactionStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.BRIDGE_TRANSACTION_CREATE, createBridgeTransaction];
