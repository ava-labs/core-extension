import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { ApprovalEvent, ApprovalRequest } from '../models';

export function isApprovalRequest(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<ApprovalRequest> {
  return evt?.name === ApprovalEvent.ApprovalRequested;
}

export function isApprovalCleanup(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<{ actionId: string }> {
  return evt?.name === 'clean-approval';
}
