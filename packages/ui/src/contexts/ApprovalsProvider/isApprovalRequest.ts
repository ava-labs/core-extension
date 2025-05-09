import {
  ApprovalEvent,
  ApprovalRequest,
  ExtensionConnectionEvent,
} from '@core/types';

export function isApprovalRequest(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<ApprovalRequest> {
  return evt?.name === ApprovalEvent.ApprovalRequested;
}
