import { Stack } from '@avalabs/k2-alpine';
import { isTokenWithBalancePVM } from '@core/common';
import {
  useBalancesContext,
  useNetworkContext,
  useTokensWithBalances,
} from '@core/ui';
import { FC, useState } from 'react';
import { AssetsErrorState } from '../../../AssetsErrorState';
import { Assets } from './Assets';
import { GeneralTokenDetails } from '../GeneralTokenDetails';
import { TabName, XPChainsTabs } from '../XPChains/Tabs';
import { StyledXPChainDetails } from '../styled';
import { useUrlState } from '../../hooks/useUrlState';

type Props = {
  networkId: number;
};
export const PchainDetails: FC<Props> = ({ networkId }) => {
  const urlState = useUrlState();
  const initialTab = urlState.xpChainTab ?? 'assets';
  const [activeTab, setActiveTab] = useState<TabName>(initialTab);

  const { getNetwork } = useNetworkContext();
  const { balances } = useBalancesContext();

  const network = getNetwork(networkId);

  const pchainBalances = useTokensWithBalances({
    network,
  });

  // Get the P-chain native token (should be the first/only token for P-chain)
  const pchainToken = pchainBalances[0];
  const _isCorrectBalance = isTokenWithBalancePVM(pchainToken);

  const activeTabOnSelect = (newTab: TabName) => {
    urlState.update(urlState.filter, networkId, 'AVAX', newTab);
    setActiveTab(newTab);
  };

  // Show nothing while balances are loading
  if (balances.loading) {
    return null;
  }

  // Show error state only after data has loaded but is invalid
  if (!_isCorrectBalance || !pchainToken) {
    return <AssetsErrorState />;
  }

  return (
    <>
      <StyledXPChainDetails>
        <Stack gap={1} display={activeTab === 'assets' ? 'flex' : 'none'}>
          <Assets balances={pchainToken} />
        </Stack>
        <Stack gap={1} display={activeTab === 'activity' ? 'flex' : 'none'}>
          <GeneralTokenDetails networkId={networkId} tokenAddress={'AVAX'} />
        </Stack>
      </StyledXPChainDetails>
      <XPChainsTabs activeTab={activeTab} setActiveTab={activeTabOnSelect} />
    </>
  );
};
