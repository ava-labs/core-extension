import { getEvmAddressFromPubKey } from '@avalabs/wallets-sdk';
import { WalletType } from '@src/background/services/wallet/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useState } from 'react';

const useIsIncorrectDevice = () => {
  const [isIncorrectDevice, setIsIncorrectDevice] = useState<boolean>(false);
  const { isWalletLocked, walletType, derivationPath } = useWalletContext();
  const { hasLedgerTransport, getPublicKey, getBtcPublicKey, appType } =
    useLedgerContext();
  const { accounts } = useAccountsContext();

  useEffect(() => {
    const compareAddresses = async () => {
      setIsIncorrectDevice(false);

      if (
        !isWalletLocked &&
        walletType === WalletType.LEDGER &&
        hasLedgerTransport &&
        derivationPath
      ) {
        try {
          const getPublicKeyByAppType = async () => {
            if (appType === LedgerAppType.AVALANCHE) {
              return getPublicKey(0, derivationPath);
            } else if (appType === LedgerAppType.BITCOIN) {
              return getBtcPublicKey(0, derivationPath);
            } else {
              throw new Error(`App type '${appType}' not supported`);
            }
          };

          if (appType !== LedgerAppType.UNKNOWN) {
            const pubKey = await getPublicKeyByAppType();
            const address = getEvmAddressFromPubKey(pubKey);
            const isMatching = accounts.primary[0]?.addressC === address;

            setIsIncorrectDevice(!isMatching);
          }
        } catch (err) {
          // some problem occured with the app
          // just wait until LedgerProvider recreates the app instance
        }
      }
    };

    compareAddresses();
  }, [
    isWalletLocked,
    walletType,
    derivationPath,
    accounts,
    getPublicKey,
    hasLedgerTransport,
    appType,
    getBtcPublicKey,
  ]);

  return isIncorrectDevice;
};

export default useIsIncorrectDevice;
