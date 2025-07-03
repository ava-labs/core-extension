import { container } from 'tsyringe';

import { Action, MultiTxAction } from '@core/types';
import { ApprovalService } from '../services/approvals/ApprovalService';

export const openApprovalWindow = async (
  action: Action | MultiTxAction,
  url: string,
) => {
  // using direct injection instead of the constructor to prevent circular dependencies
  const approvalService = container.resolve(ApprovalService);

  return approvalService.requestApproval(
    {
      ...action,
      actionId: action.actionId || crypto.randomUUID(), // Only generate the UUID if not provided
    },
    url,
  );
};
