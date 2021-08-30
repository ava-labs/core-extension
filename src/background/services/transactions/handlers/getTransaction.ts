import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { pendingTransactions } from '../transactions';

export async function getTransaction(request: ExtensionConnectionMessage) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const txId = params[0];

  if (!txId) {
    return {
      ...request,
      error: 'no tx id found in params',
    };
  }

  const currentPendingTransactions = await firstValueFrom(pendingTransactions);

  const tx = currentPendingTransactions[txId];

  return {
    ...request,
    result: tx,
  };
}

export const GetTransactionByIdRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.TRANSACTIONS_GET, getTransaction];
