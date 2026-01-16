import { isTokenWithBalancePVM } from '@core/common';
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
export const PchainDetails: FC<Props> = ({ networkId, network }) => {
  const { balances } = useBalancesContext();

  const pchainBalances = useTokensWithBalances({
    network,
  });

  // Show nothing while balances are loading
  if (balances.loading) {
    return null;
  }

  // Get the P-chain native token (should be the first/only token for P-chain)
  const [pchainToken] = pchainBalances;

  // Show error state only after data has loaded but is invalid
  if (!pchainToken || !isTokenWithBalancePVM(pchainToken)) {
    return <AssetsErrorState />;
  }

  return (
    <XPChainDetails
      networkId={networkId}
      network={network}
      Assets={<Assets balances={pchainToken} />}
    />
  );
};
