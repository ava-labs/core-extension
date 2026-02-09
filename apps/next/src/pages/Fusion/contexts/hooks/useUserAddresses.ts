import { Chain } from '@avalabs/unified-asset-transfer';

import { Account } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { getAddressForChain } from '@core/common';

type UserAddresses = {
  fromAddress: string | undefined;
  toAddress: string | undefined;
};

export const useUserAddresses = (
  account: Account | undefined,
  sourceChain: Chain | undefined,
  targetChain: Chain | undefined,
): UserAddresses => {
  const { getNetwork } = useNetworkContext();

  const fromAddress = sourceChain
    ? getAddressForChain(getNetwork(sourceChain.chainId), account)
    : undefined;

  const toAddress = targetChain
    ? getAddressForChain(getNetwork(targetChain.chainId), account)
    : undefined;

  return {
    fromAddress,
    toAddress,
  };
};
