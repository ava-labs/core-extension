import { ExtensionConnectionEvent } from '../../../connections/models';
import { ApprovalEvent, ApprovalRequest } from '@core/types/src/models';

export function isApprovalRequest(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<ApprovalRequest> {
  return evt?.name === ApprovalEvent.ApprovalRequested;
}
