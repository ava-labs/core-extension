import { ExternaSignerType } from '@core/types';
import { useIsUsingLedgerWallet } from '@core/ui';

type UseIsUsingHardwareWalletResult = {
  isUsingHardwareWallet: boolean;
  deviceType?: ExternaSignerType;
};

export const useIsUsingHardwareWallet = (): UseIsUsingHardwareWalletResult => {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

  return {
    isUsingHardwareWallet: isUsingLedgerWallet,
    deviceType: isUsingLedgerWallet ? 'ledger' : undefined,
  };
};
