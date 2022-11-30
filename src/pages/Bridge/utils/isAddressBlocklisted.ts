import { BridgeConfig } from '@avalabs/bridge-sdk';
import { Account } from '@src/background/services/accounts/models';

export const isAddressBlocklisted = (
  account: Account,
  bridgeConfig: BridgeConfig
): boolean => {
  return (
    !!(
      account.addressC &&
      bridgeConfig.config?.critical.addressBlocklist.includes(account.addressC)
    ) ||
    !!(
      account.addressBTC &&
      bridgeConfig.config?.criticalBitcoin.addressBlocklist.includes(
        account.addressBTC
      )
    )
  );
};
