import { DisplayData } from '@avalabs/vm-module-types';

import { Action, ExternaSignerType, NetworkWithCaipId } from '@core/types';

import { LedgerApprovalOverlay } from './ledger';

type HardwareApprovalOverlayProps = {
  deviceType: ExternaSignerType;
  action: Action<DisplayData>;
  network: NetworkWithCaipId;
  approve: () => Promise<unknown>;
  reject: () => void;
};

export const HardwareApprovalOverlay = ({
  deviceType,
  action,
  network,
  approve,
  reject,
}: HardwareApprovalOverlayProps) => {
  if (deviceType === 'ledger') {
    return (
      <LedgerApprovalOverlay
        action={action}
        approve={approve}
        reject={reject}
        network={network}
      />
    );
  }
};
