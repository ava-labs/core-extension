import { useApproveAction } from './useApproveAction';

export const useBatchApproveAction = (actionId: string) => {
  return useApproveAction(actionId, true);
};
