import { base58, hex } from '@scure/base';
import { useCallback } from 'react';

import { useNetworkContext } from '../contexts';
import { getExplorerAddressByNetwork, resolve } from '@core/common';

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
