import { DisplayData } from '@avalabs/vm-module-types';

import { Action, ExternaSignerType, NetworkWithCaipId } from '@core/types';

import { LedgerApprovalOverlay } from './ledger';
import { KeystoneQRApprovalOverlay } from './keystone-qr';
import { KeystoneUSBApprovalOverlay } from './keystone-usb';

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
  } else if (deviceType === 'keystone-qr') {
    return (
      <KeystoneQRApprovalOverlay
        deviceType={deviceType}
        action={action}
        network={network}
        approve={approve}
        reject={reject}
      />
    );
  } else if (deviceType === 'keystone-usb') {
    return <KeystoneUSBApprovalOverlay />;
  }
};
