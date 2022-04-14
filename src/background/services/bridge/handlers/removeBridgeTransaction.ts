import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { removeBridgeTransaction } from '../bridge';

export async function removeBridgeTransactionHandler(
  request: ExtensionConnectionMessage
) {
  const [txHash] = request.params || [];
  if (!txHash) return { ...request, error: 'missing txHash' };

  const error = await removeBridgeTransaction(txHash);

  if (error) {
    return {
      ...request,
      error,
    };
  }

  return {
    ...request,
    result: true,
  };
}

export const RemoveBridgeTransactionStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [
  ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
  removeBridgeTransactionHandler,
];
