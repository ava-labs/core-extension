import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import {
  isTxFinalizedUpdate,
  isTxParamsUpdate,
  isTxStatusUpdate,
} from '../models';
import { pendingTransactions, updateTransaction } from '../transactions';

export async function updateTransactionById(
  request: ExtensionConnectionMessage
) {
  const params = request.params;
  if (!params) {
    return {
      ...request,
      error: 'no params on request',
    };
  }

  const update = params[0];

  if (!update) {
    return {
      ...request,
      error: 'no updates found in params',
    };
  }

  const isKnownTxType = [
    isTxStatusUpdate(update),
    isTxFinalizedUpdate(update),
    isTxParamsUpdate(update),
  ].some((isKnown) => isKnown);

  if (!isKnownTxType) {
    return {
      ...request,
      error: 'malformed or unsupported update',
    };
  }

  updateTransaction.next(update);

  const currentPendingTransactions = await firstValueFrom(pendingTransactions);

  return {
    ...request,
    result: currentPendingTransactions[update.id],
  };
}

export const UpdateTransactionByIdRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.TRANSACTIONS_UPDATE, updateTransactionById];
