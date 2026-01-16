import { isTokenWithBalanceAVM } from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { useBalancesContext, useTokensWithBalances } from '@core/ui';
import { FC } from 'react';
import { AssetsErrorState } from '../../../AssetsTab';
import { XPChainDetails } from '../XPChains/XPChainDetails';
import { Assets } from './Assets';

type Props = {
  networkId: number;
  network: NetworkWithCaipId;
};
export const XchainDetails: FC<Props> = ({ networkId, network }) => {
  const { balances } = useBalancesContext();
  const xchainBalances = useTokensWithBalances({
    network,
  });

  // Show nothing while balances are loading
  if (balances.loading) {
    return null;
  }

  // Get the X-chain native token (should be the first/only token for P-chain)
  const [xchainToken] = xchainBalances;

  // Show error state only after data has loaded but is invalid
  if (!xchainToken || !isTokenWithBalanceAVM(xchainToken)) {
    return <AssetsErrorState />;
  }

  return (
    <XPChainDetails
      networkId={networkId}
      network={network}
      Assets={<Assets balances={xchainToken} />}
    />
  );
};
