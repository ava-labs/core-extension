import { FC, useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';

import { Action, ExternaSignerType, NetworkWithCaipId } from '@core/types';

import { HardwareApprovalDrawer } from '../common/ApprovalDrawer';

import { StateComponentProps } from './types';
import {
  QRApprovalState,
  useQRApprovalState,
} from './hooks/useQRApprovalState';
import { Loading, ScanTransactionQR, ScanSignatureQR } from './components';

type HardwareApprovalOverlayProps = {
  deviceType: Extract<ExternaSignerType, 'keystone-qr'>;
  action: Action<DisplayData>;
  network: NetworkWithCaipId;
  approve: () => Promise<unknown>;
  reject: () => void;
};

const ComponentPerPhase: Record<
  QRApprovalState['phase'],
  FC<StateComponentProps>
> = {
  'waiting-for-tx-code': Loading,
  'scan-transaction-qr': ScanTransactionQR,
  'scan-signature-qr': ScanSignatureQR,
};

export const KeystoneQRApprovalOverlay: FC<HardwareApprovalOverlayProps> = ({
  approve,
  reject,
}) => {
  const state = useQRApprovalState();

  useEffect(() => {
    approve();
    // Only run this once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = ComponentPerPhase[state.phase];

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component state={state} approve={approve} reject={reject} />
    </HardwareApprovalDrawer>
  );
};
