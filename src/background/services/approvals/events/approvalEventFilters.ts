import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { ApprovalRequest } from '../models';
import { ApprovalEvent } from '../models';

export function isApprovalRequest(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<ApprovalRequest> {
  return evt?.name === ApprovalEvent.ApprovalRequested;
}
