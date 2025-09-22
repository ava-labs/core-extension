import { useCallback, useState } from 'react';

import { ExternaSignerType } from '@core/types';

type UseApprovalHelpersProps = {
  onApprove: () => Promise<unknown>;
  onReject: () => unknown;
  isUsingHardwareWallet: boolean;
  deviceType?: ExternaSignerType;
};

type UseApprovalHelpersReturn = {
  isUsingHardwareWallet: boolean;
  deviceType?: ExternaSignerType;
  isApprovalOverlayVisible: boolean;
  handleApproval: () => Promise<unknown>;
  handleRejection: () => Promise<unknown>;
};

export function useApprovalHelpers({
  onApprove,
  onReject,
  isUsingHardwareWallet,
  deviceType,
}: UseApprovalHelpersProps): UseApprovalHelpersReturn {
  const [isApprovalOverlayVisible, setIsApprovalOverlayVisible] =
    useState(false);

  const handleApproval = useCallback(async () => {
    if (!isUsingHardwareWallet) {
      return onApprove();
    }

    setIsApprovalOverlayVisible(true);
  }, [isUsingHardwareWallet, onApprove]);

  const handleRejection = useCallback(async () => {
    setIsApprovalOverlayVisible(false);

    await onReject();
  }, [onReject]);

  return {
    isUsingHardwareWallet,
    deviceType,
    isApprovalOverlayVisible,
    handleApproval,
    handleRejection,
  };
}
