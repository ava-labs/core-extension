import {
  BtcSigner,
  EvmSignerWithMessage,
  Transfer,
  CompletedTransfer,
  FailedTransfer,
  SourcePendingTransfer,
  TargetPendingTransfer,
  SourceCompletedTransfer,
  SolanaSigner,
  RefundedTransfer,
} from '@avalabs/fusion-sdk';

export type UnifiedTransferSigners = {
  evm: EvmSignerWithMessage;
  btc: BtcSigner;
  svm: SolanaSigner;
};

export type TrackedTransfer = {
  transfer: Transfer;
  isRead: boolean;
  untrack?: () => void;
};

export type TrackedTransfers = Record<Transfer['id'], TrackedTransfer>;

export type TransferTrackingStateUpdateEvent = {
  name: 'tracked-transfers-updated';
  value: TrackedTransfers;
};

export const isTransferFinished = (
  transfer: Transfer,
): transfer is CompletedTransfer | FailedTransfer =>
  isCompletedTransfer(transfer) || isFailedTransfer(transfer);

export const isRefundedTransfer = (
  transfer: Transfer,
): transfer is RefundedTransfer => transfer.status === 'refunded';

export const isCompletedTransfer = (
  transfer: Transfer,
): transfer is CompletedTransfer => transfer.status === 'completed';

export const isConcludedTransfer = (
  transfer: Transfer,
): transfer is CompletedTransfer | FailedTransfer | RefundedTransfer =>
  isCompletedTransfer(transfer) ||
  isFailedTransfer(transfer) ||
  isRefundedTransfer(transfer);

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
