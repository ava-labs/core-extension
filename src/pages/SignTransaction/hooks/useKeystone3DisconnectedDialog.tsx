import { useCallback, useEffect } from 'react';
import useIsUsingKeystone3Wallet from '@src/hooks/useIsUsingKeystone3Wallet';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { tabs } from 'webextension-polyfill';

export function useKeystone3DisconnectedDialog(onCancel: () => void) {
  const isUsingKeystone3Wallet = useIsUsingKeystone3Wallet();

  const gotoTroubleshooting = useCallback(() => {
    onCancel();
    tabs.create({
      url: '/fullscreen.html#/keystone3/troubleshooting',
    });
  }, [onCancel]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUsingKeystone3Wallet) {
        createKeystoneTransport().catch(gotoTroubleshooting);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [gotoTroubleshooting, isUsingKeystone3Wallet]);
}
