import { ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import { LoadingSpinnerIcon, useDialog } from '@avalabs/react-components';
import { WalletType } from '@src/background/services/wallet/models';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';

const StyledLoadingSpinnerIcon = styled(LoadingSpinnerIcon)`
  margin: 24px 0 0;
`;

export function useLedgerDisconnectedDialog(
  onCancel: () => void,
  requestedApp?: LedgerAppType
): boolean {
  const theme = useTheme();
  const { walletType } = useWalletContext();
  const { hasLedgerTransport, appType } = useLedgerContext();
  const { showDialog, clearDialog } = useDialog();
  const { network } = useNetworkContext();
  const [hasCorrectApp, setHasCorrectApp] = useState(false);

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
        title: 'Ledger Disconnected',
        body: 'Please connect your Ledger device to approve this transaction.',
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
            ? 'Connect Ledger'
            : undefined,
        onConfirm: () => {
          openExtensionNewWindow(`ledger/connect?app=${requiredAppType}`, '');
        },
        cancelText: 'Cancel',
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [clearDialog, requiredAppType, onCancel, showDialog, theme.colors.icon1]);

  const showIncorrectAppDialog = useCallback(() => {
    showDialog(
      {
        title: 'Wrong App',
        body: `Please switch to the ${requiredAppType} app on your Ledger`,
        width: '343px',
        confirmText:
          requiredAppType !== LedgerAppType.AVALANCHE
            ? 'Connect Ledger'
            : undefined,
        onConfirm: () => {
          openExtensionNewWindow(`ledger/connect?app=${requiredAppType}`, '');
        },
        cancelText: 'Cancel',
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [clearDialog, requiredAppType, onCancel, showDialog]);

  useEffect(() => {
    clearDialog();

    if (walletType !== WalletType.LEDGER) {
      return;
    }

    const hasCorrectApp = hasLedgerTransport && appType === requiredAppType;
    if (!hasLedgerTransport) {
      showLedgerDisconnectedDialog();
    } else if (!hasCorrectApp) {
      showIncorrectAppDialog();
    }
    setHasCorrectApp(hasCorrectApp);
  }, [
    hasLedgerTransport,
    showLedgerDisconnectedDialog,
    walletType,
    appType,
    showIncorrectAppDialog,
    clearDialog,
    requiredAppType,
  ]);

  return hasCorrectApp;
}
