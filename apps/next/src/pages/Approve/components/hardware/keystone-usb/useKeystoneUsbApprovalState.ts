import { useKeystoneUsbContext } from '@core/ui';
import { isPchainNetwork, isXchainNetwork } from '@core/common';
import { isCoreEthNetwork, NetworkWithCaipId } from '@core/types';

import { isKeystoneFirmwareCompatible } from './lib/isKeystoneFirmwareCompatible';
import {
  KeystoneUsbApprovalState,
  REQUIRED_FIRMWARE_VERSION_FOR_XP_SIGNING,
} from './types';

export const useKeystoneUsbApprovalState = (
  network: NetworkWithCaipId,
): KeystoneUsbApprovalState => {
  const { hasKeystoneTransport, wasTransportAttempted, version } =
    useKeystoneUsbContext();

  if (!wasTransportAttempted) {
    return 'loading';
  }

  if (!hasKeystoneTransport) {
    return 'disconnected';
  }

  const requiresXPCoreEthSigning =
    isPchainNetwork(network) ||
    isXchainNetwork(network) ||
    isCoreEthNetwork(network);

  if (requiresXPCoreEthSigning) {
    // For X/P/CoreEth signing, we must validate the firmware version.
    // If we don't know the version, we assume it's compatible.
    const isCompatibleFirmwareVersion =
      !version ||
      isKeystoneFirmwareCompatible(
        version,
        REQUIRED_FIRMWARE_VERSION_FOR_XP_SIGNING,
      );

    if (!isCompatibleFirmwareVersion) {
      return 'incorrect-version-for-xp';
    }
  }

  return 'pending';
};
