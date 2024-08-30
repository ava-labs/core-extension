import { Action, ActionStatus } from '@src/background/services/actions/models';
import { ACTION_HANDLED_BY_MODULE } from '@src/background/models';

import { ApprovalParamsWithContext } from '../models';

export const buildBtcSendTransactionAction = (
  params: ApprovalParamsWithContext
): Action => {
  return {
    // ActionService needs to know it should not look for the handler in the DI registry,
    // but rather just emit the events for the ApprovalController to listen for
    [ACTION_HANDLED_BY_MODULE]: true,
    dappInfo: params.request.dappInfo,
    signingData: params.signingData,
    context: params.request.context,
    status: ActionStatus.PENDING,
    tabId: params.request.context?.tabId,
    params: params.request.params,
    displayData: params.displayData,
    scope: params.request.chainId,
    id: params.request.requestId,
    method: params.request.method,
  };
};
