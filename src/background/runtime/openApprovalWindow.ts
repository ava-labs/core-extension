import { container } from 'tsyringe';

import type { Action, MultiTxAction } from '../services/actions/models';
import { ApprovalService } from '../services/approvals/ApprovalService';

export const openApprovalWindow = async (
  action: Action | MultiTxAction,
  url: string,
) => {
  const actionId = crypto.randomUUID();
  // using direct injection instead of the constructor to prevent circular dependencies
  const approvalService = container.resolve(ApprovalService);

  return approvalService.requestApproval(
    {
      ...action,
      actionId,
    },
    url,
  );
};
