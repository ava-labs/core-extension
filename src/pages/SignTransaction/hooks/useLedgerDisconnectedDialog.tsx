import { LoadingSpinnerIcon, useDialog } from '@avalabs/react-components';
import { useLedgerSupportContext } from '@src/contexts/LedgerSupportProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';

export function useLedgerDisconnectedDialog() {
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
          <LoadingSpinnerIcon color={theme.colors.icon1} height="32px" />
        ),
      },
      false
    );
  }, [showDialog, theme.colors.icon1]);

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
