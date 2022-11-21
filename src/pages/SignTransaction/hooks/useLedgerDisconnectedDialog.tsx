import { ChainId, Network, NetworkVMType } from '@avalabs/chains-sdk';
import { LoadingSpinnerIcon, useDialog } from '@avalabs/react-components';
import { WalletType } from '@src/background/services/wallet/models';
import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@src/contexts/LedgerProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { LedgerWrongVersion } from '@src/pages/Ledger/LedgerWrongVersion';
import { isLedgerVersionCompatible } from '@src/utils/isLedgerVersionCompatible';

const StyledLoadingSpinnerIcon = styled(LoadingSpinnerIcon)`
  margin: 24px 0 0;
`;

export function useLedgerDisconnectedDialog(
  onCancel: () => void,
  requestedApp?: LedgerAppType,
  otherNetwork?: Network
): boolean {
  const { t } = useTranslation();
  const theme = useTheme();
  const { walletType } = useWalletContext();
  const {
    hasLedgerTransport,
    wasTransportAttempted,
    appType,
    popDeviceSelection,
    avaxAppVersion,
  } = useLedgerContext();
  const { showDialog, clearDialog } = useDialog();
  const { network: activeNetwork } = useNetworkContext();
  const [hasCorrectApp, setHasCorrectApp] = useState(false);
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const network = otherNetwork ?? activeNetwork;

  const requiredAppType = useMemo(() => {
    if (requestedApp) {
      return requestedApp;
    }

    if (network?.vmName === NetworkVMType.BITCOIN) {
      return LedgerAppType.BITCOIN;
    }

    if (
      network?.chainId === ChainId.AVALANCHE_MAINNET_ID ||
      network?.chainId === ChainId.AVALANCHE_TESTNET_ID
    ) {
      return LedgerAppType.AVALANCHE;
    }

    return LedgerAppType.ETHEREUM;
  }, [network, requestedApp]);

  const showLedgerDisconnectedDialog = useCallback(() => {
    showDialog(
      {
        title: t('Ledger Disconnected'),
        body: t(
          'Please connect your Ledger device to approve this transaction.'
        ),
        width: '343px',
        component:
          requiredAppType !== LedgerAppType.AVALANCHE ? (
            <StyledLoadingSpinnerIcon
              color={theme.colors.icon1}
              height="32px"
            />
          ) : undefined,
        confirmText:
          requiredAppType !== LedgerAppType.AVALANCHE
            ? t('Connect Ledger')
            : undefined,
        onConfirm: () => {
          if (isConfirm) {
            popDeviceSelection();
          } else {
            openExtensionNewWindow(`ledger/connect?app=${requiredAppType}`, '');
            window.close();
          }
        },
        cancelText: t('Cancel'),
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [
    showDialog,
    t,
    requiredAppType,
    theme.colors.icon1,
    isConfirm,
    popDeviceSelection,
    onCancel,
    clearDialog,
  ]);

  const showIncorrectAppDialog = useCallback(() => {
    showDialog(
      {
        title: t('Wrong App'),
        body: t('Please switch to the {{requiredAppType}} app on your Ledger', {
          requiredAppType,
        }),
        width: '343px',
        confirmText:
          requiredAppType !== LedgerAppType.AVALANCHE
            ? t('Connect Ledger')
            : undefined,
        onConfirm: () => {
          if (isConfirm) {
            popDeviceSelection();
          } else {
            openExtensionNewWindow(`ledger/connect?app=${requiredAppType}`, '');
            window.close();
          }
        },
        cancelText: t('Cancel'),
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [
    showDialog,
    t,
    requiredAppType,
    isConfirm,
    popDeviceSelection,
    onCancel,
    clearDialog,
  ]);

  const showIncorrectAvaxVersionDialog = useCallback(() => {
    showDialog(
      {
        title: '',
        width: '343px',
        component: (
          <LedgerWrongVersion
            className="dialog"
            onClose={() => {
              onCancel();
              clearDialog();
            }}
          />
        ),
      },
      false
    );
  }, [showDialog, onCancel, clearDialog]);

  useEffect(() => {
    clearDialog();
    // only show dialogs for ledger wallets and
    // wait for transport to be attempted at least once
    if (walletType !== WalletType.LEDGER || !wasTransportAttempted) {
      return;
    }

    const hasCorrectApp = hasLedgerTransport && appType === requiredAppType;
    if (!hasLedgerTransport) {
      showLedgerDisconnectedDialog();
    } else if (!hasCorrectApp) {
      showIncorrectAppDialog();
    } else if (
      avaxAppVersion &&
      !isLedgerVersionCompatible(avaxAppVersion, REQUIRED_LEDGER_VERSION)
    ) {
      showIncorrectAvaxVersionDialog();
    }
    setHasCorrectApp(hasCorrectApp);
  }, [
    wasTransportAttempted,
    hasLedgerTransport,
    showLedgerDisconnectedDialog,
    walletType,
    appType,
    showIncorrectAppDialog,
    requiredAppType,
    clearDialog,
    avaxAppVersion,
    showIncorrectAvaxVersionDialog,
  ]);

  return hasCorrectApp;
}
