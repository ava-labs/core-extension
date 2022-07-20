import { BridgeConfig } from '@avalabs/bridge-sdk';
import { Account } from '@src/background/services/accounts/models';

export const isAddressWhitelisted = (
  account: Account,
  bridgeConfig: BridgeConfig
): boolean => {
  return (
    !!(
      account.addressC &&
      bridgeConfig.config?.critical.addressWhitelist.includes(account.addressC)
    ) ||
    !!(
      account.addressBTC &&
      bridgeConfig.config?.criticalBitcoin.addressWhitelist.includes(
        account.addressBTC
      )
    )
  );
};
