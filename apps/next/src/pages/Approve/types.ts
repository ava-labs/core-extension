import { DappInfo, DisplayData } from '@avalabs/vm-module-types';

import { useApproveAction } from '@core/ui';
import {
  Action,
  ExtractSigningData,
  isMessageSigningMethod,
  NetworkWithCaipId,
  MessageSigningData,
  TransactionSigningMethod,
} from '@core/types';

type ApproveActionResult = ReturnType<typeof useApproveAction>;

export type UpdateActionFn = ApproveActionResult['updateAction'];
export type CancelActionFn = ApproveActionResult['cancelHandler'];
export type ActionError = ApproveActionResult['error'];

export type ActionDetailsProps = {
  network: NetworkWithCaipId;
  action: Action<DisplayData>;
  updateAction: ApproveActionResult['updateAction'];
  error: ApproveActionResult['error'];
};

export type MessageDetailsProps = ActionDetailsProps & {
  action: MessageSigningRequest;
};

export type MessageSigningRequest = Action<DisplayData> & {
  actionId: string;
  signingData: MessageSigningData;
};

export type TransactionSigningRequest = Action<DisplayData> & {
  actionId: string;
  signingData: ExtractSigningData<TransactionSigningMethod>;
};

export type ActionWithDappInfo = Action<DisplayData> & {
  dappInfo: DappInfo;
};

export const isMessageApproval = (
  action: Action<DisplayData>,
): action is MessageSigningRequest => {
  return Boolean(
    action &&
      action.actionId &&
      action.signingData &&
      isMessageSigningMethod(action.signingData.type),
  );
};

export const isTransactionApproval = (
  action: Action<DisplayData>,
): action is TransactionSigningRequest => {
  return Boolean(
    action &&
      action.actionId &&
      action.signingData &&
      !isMessageSigningMethod(action.signingData.type),
  );
};

export const hasDappInfo = (
  action: Action<DisplayData>,
): action is ActionWithDappInfo => Boolean(action && action.dappInfo);
