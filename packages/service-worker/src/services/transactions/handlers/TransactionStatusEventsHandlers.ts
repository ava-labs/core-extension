import { RpcMethod } from '@avalabs/vm-module-types';
import {
  AvalancheSendTransactionHandlers,
  TransactionStatusEventBuilders,
} from './avalancheSendTransactionHandler';

export const TransactionStatusEventsHandlers: Partial<
  Record<string, TransactionStatusEventBuilders>
> = {
  [RpcMethod.AVALANCHE_SEND_TRANSACTION]: AvalancheSendTransactionHandlers,
};
