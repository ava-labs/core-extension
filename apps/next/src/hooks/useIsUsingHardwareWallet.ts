import { ExternaSignerType } from '@core/types';
import {
  useIsUsingKeystone3Wallet,
  useIsUsingKeystoneWallet,
  useIsUsingLedgerWallet,
} from '@core/ui';

type UseIsUsingHardwareWalletResult = {
  isUsingHardwareWallet: boolean;
  deviceType?: ExternaSignerType;
};

export const useIsUsingHardwareWallet = (): UseIsUsingHardwareWalletResult => {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingKeystone3Wallet = useIsUsingKeystone3Wallet();

  const isUsingHardwareWallet =
    isUsingLedgerWallet || isUsingKeystoneWallet || isUsingKeystone3Wallet;

  const deviceType = isUsingHardwareWallet
    ? getSignerType({
        isUsingLedgerWallet,
        isUsingKeystoneWallet,
        isUsingKeystone3Wallet,
      })
    : undefined;

  return {
    isUsingHardwareWallet,
    deviceType,
  };
};

type GetSignerTypeParams = {
  isUsingLedgerWallet: boolean;
  isUsingKeystoneWallet: boolean;
  isUsingKeystone3Wallet: boolean;
};

type GetSignerTypeReturn = ExternaSignerType;

const getSignerType = ({
  isUsingLedgerWallet,
  isUsingKeystoneWallet,
  isUsingKeystone3Wallet,
}: GetSignerTypeParams): GetSignerTypeReturn => {
  if (isUsingLedgerWallet) {
    return 'ledger';
  }
  if (isUsingKeystoneWallet) {
    return 'keystone-qr';
  }
  if (isUsingKeystone3Wallet) {
    return 'keystone-usb';
  }

  throw new Error('Unknown signer type');
};
