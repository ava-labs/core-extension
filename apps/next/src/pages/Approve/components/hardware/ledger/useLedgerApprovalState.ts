import { DisplayData, RpcMethod } from '@avalabs/vm-module-types';

import {
  isBitcoinNetwork,
  isEthereumNetwork,
  isLedgerVersionCompatible,
  isSolanaNetwork,
} from '@core/common';
import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@core/ui';
import { Action, NetworkWithCaipId } from '@core/types';

import { isMessageApproval } from '@/pages/Approve/types';

import { LedgerApprovalState } from './types';

type UseLedgerApprovalState = (
  network: NetworkWithCaipId,
  action: Action<DisplayData>,
) => LedgerApprovalState;

export const useLedgerApprovalState: UseLedgerApprovalState = (
  network,
  action,
) => {
  const { hasLedgerTransport, wasTransportAttempted, appType, avaxAppVersion } =
    useLedgerContext();

  if (!wasTransportAttempted) {
    return { state: 'loading' };
  }

  if (!hasLedgerTransport) {
    return { state: 'disconnected' };
  }

  const requiredApp = getRequiredApp(network, action);

  if (appType !== requiredApp) {
    return { state: 'incorrect-app', requiredApp };
  }

  if (
    avaxAppVersion &&
    !isLedgerVersionCompatible(avaxAppVersion, REQUIRED_LEDGER_VERSION)
  ) {
    return {
      state: 'incorrect-version',
      requiredVersion: REQUIRED_LEDGER_VERSION,
      requiredApp,
    };
  }

  return {
    state: 'pending',
    requiredApp,
    requiredVersion: REQUIRED_LEDGER_VERSION,
  };
};

const getRequiredApp = (
  network: NetworkWithCaipId,
  action: Action<DisplayData>,
) => {
  if (isBitcoinNetwork(network)) {
    return LedgerAppType.BITCOIN;
  }

  if (isSolanaNetwork(network)) {
    return LedgerAppType.SOLANA;
  }

  if (isMessageApproval(action)) {
    return action.method === RpcMethod.AVALANCHE_SIGN_MESSAGE
      ? LedgerAppType.AVALANCHE
      : LedgerAppType.ETHEREUM;
  }

  if (isEthereumNetwork(network)) {
    return LedgerAppType.ETHEREUM;
  }

  return LedgerAppType.AVALANCHE;
};
