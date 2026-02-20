import {
  BtcSigner,
  EvmSignerWithMessage,
  Transfer,
  CompletedTransfer,
  FailedTransfer,
  SourcePendingTransfer,
  TargetPendingTransfer,
  SourceCompletedTransfer,
} from '@avalabs/unified-asset-transfer';

export type UnifiedTransferSigners = {
  evm: EvmSignerWithMessage;
  btc: BtcSigner;
};

export type TrackedTransfers = Record<Transfer['id'], Transfer>;

export type TransferTrackingStateUpdateEvent = {
  name: 'tracked-transfers-updated';
  value: TrackedTransfers;
};

export const isTransferFinished = (
  transfer: Transfer,
): transfer is CompletedTransfer | FailedTransfer =>
  isCompletedTransfer(transfer) || isFailedTransfer(transfer);

export const isCompletedTransfer = (
  transfer: Transfer,
): transfer is CompletedTransfer => transfer.status === 'completed';

export const isFailedTransfer = (
  transfer: Transfer,
): transfer is FailedTransfer => transfer.status === 'failed';

export const isTransferInProgress = (
  transfer: Transfer,
): transfer is
  | SourcePendingTransfer
  | TargetPendingTransfer
  | SourceCompletedTransfer =>
  transfer.status === 'source-pending' ||
  transfer.status === 'target-pending' ||
  transfer.status === 'source-completed';

export const isCrossChainTransfer = (transfer: Transfer) =>
  transfer.sourceChain.chainId !== transfer.targetChain.chainId;
