import { DisplayData, TokenDiff, TokenType } from '@avalabs/vm-module-types';

import {
  isBitcoinNetwork,
  isEthereumNetwork,
  isLedgerVersionCompatible,
  isSolanaNetwork,
} from '@core/common';
import {
  LedgerAppType,
  MAX_BITCOIN_APP_VERSION,
  REQUIRED_LEDGER_VERSION,
  useActiveLedgerAppInfo,
  useLedgerContext,
} from '@core/ui';
import { Action, NetworkWithCaipId } from '@core/types';

import { isTransactionApproval } from '@/pages/Approve/types';
import { useLedgerPolicyRegistrationState } from '@/contexts';

import { LedgerApprovalState } from './types';

type UseLedgerApprovalState = (
  network: NetworkWithCaipId,
  action: Action<DisplayData>,
) => LedgerApprovalState;

const isErc20TokenDiff = (tokenDiff: TokenDiff) => {
  return (
    tokenDiff.token &&
    'type' in tokenDiff.token &&
    tokenDiff.token.type === TokenType.ERC20
  );
};

const requiresBlindSigning = (
  network: NetworkWithCaipId,
  action: Action<DisplayData>,
) => {
  if (!isEthereumNetwork(network) || !isTransactionApproval(action)) {
    return false;
  }

  // Ethereum app often requires blind signing for ERC20 token transfers
  return (
    action.displayData.balanceChange?.outs.some(isErc20TokenDiff) ||
    action.displayData.balanceChange?.ins.some(isErc20TokenDiff) ||
    action.displayData.tokenApprovals?.approvals.some(
      ({ token }) => token.type === TokenType.ERC20,
    )
  );
};
export const useLedgerApprovalState: UseLedgerApprovalState = (
  network,
  action,
) => {
  const { hasLedgerTransport, wasTransportAttempted } = useLedgerContext();
  const { appType, appVersion, appConfig } = useActiveLedgerAppInfo();
  const { shouldRegisterBtcWalletPolicy } = useLedgerPolicyRegistrationState();

  const requiredApp = getRequiredApp(network);
  const isBlindSigningRequired = requiresBlindSigning(network, action);
  const isRequiredConfig =
    !isBlindSigningRequired || appConfig?.isBlindSigningEnabled;

  if (!wasTransportAttempted) {
    return { state: 'loading' };
  }

  if (!hasLedgerTransport) {
    return { state: 'disconnected', requiredApp };
  }

  if (!isCompatibleApp(requiredApp, appType, appVersion)) {
    return { state: 'incorrect-app', requiredApp };
  }

  if (
    appVersion &&
    appType === LedgerAppType.AVALANCHE &&
    !isLedgerVersionCompatible(appVersion, REQUIRED_LEDGER_VERSION)
  ) {
    return {
      state: 'incorrect-version',
      requiredVersion: REQUIRED_LEDGER_VERSION,
      requiredApp,
    };
  }

  if (
    appVersion &&
    appType === LedgerAppType.BITCOIN &&
    !isLedgerVersionCompatible(appVersion, MAX_BITCOIN_APP_VERSION, 'maximum')
  ) {
    return {
      state: 'unsupported-btc-version',
      currentVersion: appVersion,
      maximumVersion: MAX_BITCOIN_APP_VERSION,
    };
  }

  if (
    [LedgerAppType.BITCOIN, LedgerAppType.BITCOIN_RECOVERY].includes(appType) &&
    shouldRegisterBtcWalletPolicy
  ) {
    return {
      state: 'btc-policy-needed',
    };
  }

  if (!isRequiredConfig) {
    return {
      state: 'blind-signing-required',
      requiredApp,
    };
  }

  return {
    state: 'pending',
    requiredApp,
  };
};

const isCompatibleApp = (
  requiredApp: LedgerAppType,
  appType: LedgerAppType,
  appVersion: string | null,
) => {
  if (
    requiredApp === LedgerAppType.BITCOIN &&
    appType === LedgerAppType.BITCOIN_RECOVERY
  ) {
    return true;
  }

  if (
    requiredApp === LedgerAppType.BITCOIN &&
    appType === LedgerAppType.BITCOIN &&
    appVersion &&
    isLedgerVersionCompatible(appVersion, MAX_BITCOIN_APP_VERSION, 'maximum')
  ) {
    return true;
  }

  return requiredApp === appType;
};

const getRequiredApp = (network: NetworkWithCaipId) => {
  if (isBitcoinNetwork(network)) {
    return LedgerAppType.BITCOIN;
  }

  if (isSolanaNetwork(network)) {
    return LedgerAppType.SOLANA;
  }

  if (isEthereumNetwork(network)) {
    return LedgerAppType.ETHEREUM;
  }

  return LedgerAppType.AVALANCHE;
};
