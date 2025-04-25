import { Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@/contexts/LedgerProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LedgerWrongVersionContent } from '@/pages/Ledger/LedgerWrongVersion';
import { isLedgerVersionCompatible } from '@core/utils';
import useIsUsingLedgerWallet from '@/hooks/useIsUsingLedgerWallet';
import { useDialog } from '@/contexts/DialogContextProvider';
import { LedgerDisconnected } from '@/pages/Ledger/LedgerDisconnected';
import { LedgerIncorrectApp } from '@/pages/Ledger/LedgerIncorrectApp';
import { isEthereumNetwork } from '@core/service-worker';

export function useLedgerDisconnectedDialog(
  onCancel: () => void,
  requestedApp?: LedgerAppType,
  otherNetwork?: Network,
): boolean {
  const { t } = useTranslation();
  const { hasLedgerTransport, wasTransportAttempted, appType, avaxAppVersion } =
    useLedgerContext();
  const { showDialog, clearDialog } = useDialog();
  const { network: activeNetwork } = useNetworkContext();
  const [hasCorrectApp, setHasCorrectApp] = useState(false);
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const network = otherNetwork ?? activeNetwork;

  const requiredAppType = useMemo(() => {
    if (requestedApp) {
      return requestedApp;
    }

    if (network?.vmName === NetworkVMType.BITCOIN) {
      return LedgerAppType.BITCOIN;
    }

    if (network && isEthereumNetwork(network)) {
      return LedgerAppType.ETHEREUM;
    }

    return LedgerAppType.AVALANCHE;
  }, [network, requestedApp]);

  const showLedgerDisconnectedDialog = useCallback(() => {
    showDialog({
      title: t('Ledger Disconnected'),
      content: <LedgerDisconnected requiredAppType={requiredAppType} />,
      open: true,
      onClose: () => {
        onCancel();
        clearDialog();
      },
    });
  }, [clearDialog, onCancel, requiredAppType, showDialog, t]);

  const showIncorrectAppDialog = useCallback(() => {
    showDialog({
      title: t('Wrong App'),
      content: <LedgerIncorrectApp requiredAppType={requiredAppType} />,
      open: true,
      onClose: () => {
        onCancel();
        clearDialog();
      },
    });
  }, [showDialog, t, requiredAppType, onCancel, clearDialog]);

  const showIncorrectAvaxVersionDialog = useCallback(() => {
    showDialog({
      title: t('Update Required'),
      content: <LedgerWrongVersionContent />,
      open: true,
      onClose: () => {
        onCancel();
        clearDialog();
      },
    });
  }, [showDialog, t, onCancel, clearDialog]);

  useEffect(() => {
    clearDialog();
    // only show dialogs for ledger wallets and
    // wait for transport to be attempted at least once
    if (!isUsingLedgerWallet || !wasTransportAttempted) {
      return;
    }

    const hasRequiredApp = hasLedgerTransport && appType === requiredAppType;
    if (!hasLedgerTransport) {
      showLedgerDisconnectedDialog();
    } else if (!hasRequiredApp) {
      showIncorrectAppDialog();
    } else if (
      avaxAppVersion &&
      !isLedgerVersionCompatible(avaxAppVersion, REQUIRED_LEDGER_VERSION)
    ) {
      showIncorrectAvaxVersionDialog();
    }
    setHasCorrectApp(hasRequiredApp);
  }, [
    wasTransportAttempted,
    hasLedgerTransport,
    showLedgerDisconnectedDialog,
    appType,
    showIncorrectAppDialog,
    requiredAppType,
    clearDialog,
    avaxAppVersion,
    showIncorrectAvaxVersionDialog,
    isUsingLedgerWallet,
  ]);

  return hasCorrectApp;
}
