import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIsUsingKeystone3Wallet from '@src/hooks/useIsUsingKeystone3Wallet';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { useDialog } from '@src/contexts/DialogContextProvider';

export function useKeystone3DisconnectedDialog(onCancel: () => void): boolean {
  const { t } = useTranslation();
  const { showDialog, clearDialog } = useDialog();
  const isUsingKeystoneWallet = useIsUsingKeystone3Wallet();

  const showKeystone3DisconnectedDialog = useCallback(() => {
    showDialog({
      title: t('Keystone Disconnected'),
      content: <div>hello world</div>,
      open: true,
      onClose: () => {
        onCancel();
        clearDialog();
      },
    });
  }, [clearDialog, onCancel, showDialog, t]);

  useEffect(() => {
    clearDialog();
    // only show dialogs for Keystone wallets and
    // wait for transport to be attempted at least once
    if (isUsingKeystoneWallet) {
      createKeystoneTransport().catch(showKeystone3DisconnectedDialog);
    }
  }, [showKeystone3DisconnectedDialog, isUsingKeystoneWallet, clearDialog]);
}
