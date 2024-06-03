import { container } from 'tsyringe';

import { Action } from '../services/actions/models';
import { ApprovalService } from '../services/approvals/ApprovalService';

export const openApprovalWindow = async (action: Action, url: string) => {
  const actionId = crypto.randomUUID();
  // using direct injection instead of the constructor to prevent circular dependencies
  const approvalService = container.resolve(ApprovalService);

  approvalService.requestApproval(
    {
      ...action,
      actionId,
    },
    url
  );
};
