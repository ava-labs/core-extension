import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';
import { useEffect, useState } from 'react';
import {
  LedgerAppType,
  useAccountsContext,
  useLedgerContext,
  useWalletContext,
} from '../contexts';

type Result = 'correct' | 'incorrect' | 'checking';

export const useIsCorrectDeviceForActiveWallet = () => {
  const [isCorrectDevice, setIsCorrectDevice] = useState<Result>('checking');
  const { isWalletLocked, walletDetails, isLedgerWallet } = useWalletContext();
  const { hasLedgerTransport, getPublicKey, appType } = useLedgerContext();
  const { accounts } = useAccountsContext();

  const [firstAccount] =
    (walletDetails && accounts.primary[walletDetails.id]) ?? [];
  const firstAddress = firstAccount?.addressC;

  const isLedgerWalletAccessible =
    !isWalletLocked && walletDetails && isLedgerWallet && hasLedgerTransport;

  useEffect(() => {
    if (!isLedgerWalletAccessible) {
      setIsCorrectDevice('checking');
      return;
    }

    if (appType !== LedgerAppType.AVALANCHE) {
      setIsCorrectDevice('checking');
      return;
    }

    const checkIsCorrectDevice = async (): Promise<Result> => {
      const pubKey = await getPublicKey(0, walletDetails.derivationPath);
      const address = getEvmAddressFromPubKey(pubKey);
      const result = firstAddress === address ? 'correct' : 'incorrect';
      return result;
    };

    try {
      checkIsCorrectDevice().then(setIsCorrectDevice);
    } catch {
      setIsCorrectDevice('incorrect');
    }
  }, [
    isLedgerWalletAccessible,
    getPublicKey,
    walletDetails,
    firstAddress,
    appType,
  ]);

  return isCorrectDevice;
};
