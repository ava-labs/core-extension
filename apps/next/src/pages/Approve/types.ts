import { DisplayData } from '@avalabs/vm-module-types';

import { useApproveAction } from '@core/ui';
import { Action, NetworkWithCaipId } from '@core/types';

type ApproveActionResult = ReturnType<typeof useApproveAction>;

export type ActionDetailsProps = {
  network: NetworkWithCaipId;
  action: Action<DisplayData>;
  updateAction: ApproveActionResult['updateAction'];
  error: ApproveActionResult['error'];
};
