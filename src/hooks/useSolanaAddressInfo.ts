import { useCallback } from 'react';
import { base58, hex } from '@scure/base';

import { resolve } from '@src/utils/promiseResolver';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';

import { useGetSolBalance } from './useGetSolBalance';

export const useSolanaAddressInfo = () => {
  const { getSolBalance } = useGetSolBalance();
  const { network } = useNetworkContext();

  const getAddressInfo = useCallback(
    async (publicKeyHex: string) => {
      const address = base58.encode(hex.decode(publicKeyHex));

      const [balanceInfo] = await resolve(getSolBalance(address));

      return {
        address,
        balance: balanceInfo?.balance?.balanceDisplayValue ?? 'N/A',
        explorerLink: network
          ? getExplorerAddressByNetwork(network, address, 'address')
          : '',
      };
    },
    [getSolBalance, network],
  );

  return { getAddressInfo };
};
