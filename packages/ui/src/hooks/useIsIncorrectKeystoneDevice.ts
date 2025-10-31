import { useAccountsContext } from '../contexts';
import { useKeystoneUsbContext } from '../contexts';
import { useWalletContext } from '../contexts';
import { useEffect, useState } from 'react';
import { useIsUsingKeystone3Wallet } from './useIsUsingKeystone3Wallet';

export const useIsIncorrectKeystoneDevice = () => {
  const [isIncorrectDevice, setIsIncorrectDevice] = useState<boolean>(false);
  const { isWalletLocked, walletDetails } = useWalletContext();
  const { hasKeystoneTransport, getMasterFingerprint } =
    useKeystoneUsbContext();
  const { accounts } = useAccountsContext();
  const isUsingKeystone3Wallet = useIsUsingKeystone3Wallet();
  const activeWalletAccount = accounts.active?.id;

  const firstAccount =
    activeWalletAccount && accounts.primary[activeWalletAccount];

  const firstAddress =
    firstAccount && firstAccount[0] && firstAccount[0].addressC;

  useEffect(() => {
    const compareFingerprints = async () => {
      setIsIncorrectDevice(false);

      if (
        !isWalletLocked &&
        walletDetails &&
        isUsingKeystone3Wallet &&
        hasKeystoneTransport
      ) {
        try {
          const masterFingerPrintFromDevice = await getMasterFingerprint();
          const storedMasterFingerprint = (walletDetails as any)
            .masterFingerprint;

          if (storedMasterFingerprint) {
            const isMatching =
              masterFingerPrintFromDevice === storedMasterFingerprint;

            setIsIncorrectDevice(!isMatching);
          }
        } catch (_err) {
          // some problem occurred with the device
          // just wait until KeystoneUsbProvider recreates the app instance
        }
      }
    };

    compareFingerprints();
  }, [
    isWalletLocked,
    isUsingKeystone3Wallet,
    walletDetails,
    firstAddress,
    hasKeystoneTransport,
    getMasterFingerprint,
  ]);

  return isIncorrectDevice;
};
