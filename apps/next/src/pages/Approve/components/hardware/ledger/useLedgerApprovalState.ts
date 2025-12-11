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
import { useLedgerPolicyRegistrationState } from '@/contexts';

import { LedgerApprovalState } from './types';
import { useEffect, useRef } from 'react';

type UseLedgerApprovalState = (
  network: NetworkWithCaipId,
  action: Action<DisplayData>,
) => LedgerApprovalState;

export const useLedgerApprovalState: UseLedgerApprovalState = (
  network,
  action,
) => {
  const {
    hasLedgerTransport,
    wasTransportAttempted,
    appType,
    avaxAppVersion,
    refreshActiveApp,
  } = useLedgerContext();
  const { shouldRegisterBtcWalletPolicy } = useLedgerPolicyRegistrationState();

  const requiredApp = getRequiredApp(network, action);
  const interalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (appType === requiredApp && interalRef.current) {
      clearInterval(interalRef.current);
      return;
    }

    interalRef.current = setInterval(() => {
      refreshActiveApp();
    }, 1500);

    return () => {
      if (interalRef.current) {
        clearInterval(interalRef.current);
      }
    };
  }, [refreshActiveApp, requiredApp, appType]);

  if (!wasTransportAttempted) {
    return { state: 'loading' };
  }

  if (!hasLedgerTransport) {
    return { state: 'disconnected', requiredApp };
  }

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

  if (appType === LedgerAppType.BITCOIN && shouldRegisterBtcWalletPolicy) {
    return {
      state: 'btc-policy-needed',
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
