import { NetworkVMType } from '@avalabs/chains-sdk';
import { LoadingSpinnerIcon, useDialog } from '@avalabs/react-components';
import { WalletType } from '@src/background/services/wallet/models';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';

const StyledLoadingSpinnerIcon = styled(LoadingSpinnerIcon)`
  margin: 24px 0 0;
`;

export function useLedgerDisconnectedDialog(
  onCancel: () => void,
  networkType?: NetworkVMType
): boolean {
  const theme = useTheme();
  const { walletType } = useWalletContext();
  const { hasLedgerTransport, appType } = useLedgerContext();
  const { showDialog, clearDialog } = useDialog();
  const { network } = useNetworkContext();
  const [hasCorrectApp, setHasCorrectApp] = useState(false);

  const showLedgerDisconnectedDialog = useCallback(() => {
    const isBitcoin =
      (networkType ?? network?.vmName) === NetworkVMType.BITCOIN;
    showDialog(
      {
        title: 'Ledger Disconnected',
        body: 'Please connect your Ledger device to approve this transaction.',
        width: '343px',
        component: !isBitcoin ? (
          <StyledLoadingSpinnerIcon color={theme.colors.icon1} height="32px" />
        ) : undefined,
        confirmText: isBitcoin ? 'Connect Ledger' : undefined,
        onConfirm: () => {
          openExtensionNewWindow(`ledger/connect`, '');
        },
        cancelText: 'Cancel',
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [
    clearDialog,
    network?.vmName,
    networkType,
    onCancel,
    showDialog,
    theme.colors.icon1,
  ]);

  const showIncorrectAppDialog = useCallback(() => {
    const isBitcoin =
      (networkType ?? network?.vmName) === NetworkVMType.BITCOIN;
    showDialog(
      {
        title: 'Wrong App',
        body: `Please switch to the ${
          isBitcoin ? 'Bitcoin' : 'Avalanche'
        } app on your Ledger`,
        width: '343px',
        confirmText: isBitcoin ? 'Connect Ledger' : undefined,
        onConfirm: () => {
          openExtensionNewWindow(`ledger/connect`, '', {
            screenX: window.screenX,
            screenY: window.screenY,
            viewPortHeight: window.innerHeight,
            viewportWidth: window.innerWidth,
          });
        },
        cancelText: 'Cancel',
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [clearDialog, network?.vmName, networkType, onCancel, showDialog]);

  useEffect(() => {
    clearDialog();

    if (walletType !== WalletType.LEDGER) {
      return;
    }

    const isBitcoin =
      (networkType ?? network?.vmName) === NetworkVMType.BITCOIN;
    const hasCorrectApp =
      hasLedgerTransport &&
      ((appType === LedgerAppType.BITCOIN && isBitcoin) ||
        (appType === LedgerAppType.AVALANCHE && !isBitcoin));
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
    network?.vmName,
    networkType,
  ]);

  return hasCorrectApp;
}
