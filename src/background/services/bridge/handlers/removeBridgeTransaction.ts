import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { bridge$ } from '../bridge';

export async function removeBridgeTransaction(
  request: ExtensionConnectionMessage
) {
  const [bridgeTransaction] = request.params || [];

  const bridgeState = await firstValueFrom(bridge$);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [bridgeTransaction.sourceTxHash]: unused, ...rest } =
    bridgeState.bridgeTransactions;

  bridge$.next({ ...bridgeState, bridgeTransactions: rest });

  return {
    ...request,
    result: true,
  };
}

export const RemoveBridgeTransactionStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.BRIDGE_TRANSACTION_REMOVE, removeBridgeTransaction];
