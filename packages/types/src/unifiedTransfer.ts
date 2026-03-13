import {
  BtcSigner,
  EvmSignerWithMessage,
  Transfer,
  CompletedTransfer,
  FailedTransfer,
  RefundedTransfer,
  SourcePendingTransfer,
  TargetPendingTransfer,
  SourceCompletedTransfer,
  SolanaSigner,
} from '@avalabs/fusion-sdk';

export type UnifiedTransferSigners = {
  evm: EvmSignerWithMessage;
  btc: BtcSigner;
  svm: SolanaSigner;
};

export type TrackedTransfers = Record<Transfer['id'], Transfer>;

export type TransferTrackingStateUpdateEvent = {
  name: 'tracked-transfers-updated';
  value: TrackedTransfers;
};

export const isTransferFinished = (
  transfer: Transfer,
): transfer is CompletedTransfer | FailedTransfer | RefundedTransfer =>
  isCompletedTransfer(transfer) ||
  isFailedTransfer(transfer) ||
  isRefundedTransfer(transfer);

export const isCompletedTransfer = (
  transfer: Transfer,
): transfer is CompletedTransfer => transfer.status === 'completed';

export const isFailedTransfer = (
  transfer: Transfer,
): transfer is FailedTransfer => transfer.status === 'failed';

export const isRefundedTransfer = (
  transfer: Transfer,
): transfer is RefundedTransfer => transfer.status === 'refunded';

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
