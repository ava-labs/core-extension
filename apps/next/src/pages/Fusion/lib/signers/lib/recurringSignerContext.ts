import {
  TransferSignatureReason,
  type TransferStepDetails,
} from '@avalabs/fusion-sdk';
import { RecurringSwapAction, RecurringSwapsContext } from '@core/types';

/**
 * Opaque per-request display metadata forwarded by the recurring `execute*`
 * calls onto every `step.signerContext`. Carries what the SDK's synthetic quote
 * can't (token symbols) so approval screens can render rich copy.
 */
export type RecurringSignerContext = {
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
};

const REASON_TO_ACTION: Partial<
  Record<TransferSignatureReason, RecurringSwapAction>
> = {
  [TransferSignatureReason.ScheduleRecurringSwap]: 'schedule',
  [TransferSignatureReason.PauseRecurringSwap]: 'pause',
  [TransferSignatureReason.ResumeRecurringSwap]: 'unpause',
  [TransferSignatureReason.CancelRecurringSwap]: 'cancel',
};

/**
 * Builds the approval `recurringSwaps` context from the SDK step: the action
 * comes from the typed `currentSignatureReason`, the token symbols from the
 * request's `signerContext`. Returns `undefined` for non-recurring signatures.
 */
export const getRecurringSwapsContext = (
  step: TransferStepDetails,
): RecurringSwapsContext | undefined => {
  const action = REASON_TO_ACTION[step.currentSignatureReason];

  if (!action) {
    return undefined;
  }

  const signerContext = step.signerContext as
    | RecurringSignerContext
    | undefined;

  return {
    action,
    fromTokenSymbol: signerContext?.fromTokenSymbol,
    toTokenSymbol: signerContext?.toTokenSymbol,
  };
};
