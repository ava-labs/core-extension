import { LoadingSpinnerIcon, useDialog } from '@avalabs/react-components';
import { useLedgerSupportContext } from '@src/contexts/LedgerSupportProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';

const StyledLoadingSpinnerIcon = styled(LoadingSpinnerIcon)`
  margin: 24px 0 0;
`;

export function useLedgerDisconnectedDialog(onCancel: () => void) {
  const theme = useTheme();
  const { walletType } = useWalletContext();
  const { hasLedgerTransport } = useLedgerSupportContext();
  const { showDialog, clearDialog } = useDialog();
  // maintaing dialog state to prevent accidentally closing other dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showLedgerDisconnectedDialog = useCallback(() => {
    setIsDialogOpen(true);
    showDialog(
      {
        title: 'Ledger Disconnected',
        body: 'Please connect your Ledger device to approve this transaction.',
        width: '343px',
        component: (
          <StyledLoadingSpinnerIcon color={theme.colors.icon1} height="32px" />
        ),
        cancelText: 'Cancel',
        onCancel: () => {
          onCancel();
          clearDialog();
        },
      },
      false
    );
  }, [clearDialog, onCancel, showDialog, theme.colors.icon1]);

  useEffect(() => {
    if (walletType === 'ledger' && !hasLedgerTransport && !isDialogOpen) {
      showLedgerDisconnectedDialog();
    } else if (isDialogOpen && walletType === 'ledger' && hasLedgerTransport) {
      setIsDialogOpen(false);
      clearDialog();
    }
  }, [
    clearDialog,
    hasLedgerTransport,
    showLedgerDisconnectedDialog,
    walletType,
    isDialogOpen,
  ]);

  return showLedgerDisconnectedDialog;
}
