import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIsUsingKeystone3Wallet from '@src/hooks/useIsUsingKeystone3Wallet';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { useDialog } from '@src/contexts/DialogContextProvider';
import { Keystone3Disconnected } from '@src/pages/Keystone/Keystone3Disconnected';

export function useKeystone3DisconnectedDialog(onCancel: () => void) {
  const { t } = useTranslation();
  const { showDialog, clearDialog } = useDialog();
  const isUsingKeystone3Wallet = useIsUsingKeystone3Wallet();

  const showKeystone3DisconnectedDialog = useCallback(() => {
    showDialog({
      title: t('Keystone Disconnected'),
      content: <Keystone3Disconnected />,
      open: true,
      onClose: () => {
        onCancel();
        clearDialog();
      },
    });
  }, [clearDialog, onCancel, showDialog, t]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUsingKeystone3Wallet) {
        createKeystoneTransport()
          .then(clearDialog)
          .catch(showKeystone3DisconnectedDialog);
      } else {
        clearDialog();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [showKeystone3DisconnectedDialog, isUsingKeystone3Wallet, clearDialog]);
}
