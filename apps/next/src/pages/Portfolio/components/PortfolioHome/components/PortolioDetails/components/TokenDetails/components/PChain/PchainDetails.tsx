import { Stack } from '@avalabs/k2-alpine';
import { isTokenWithBalancePVM } from '@core/common';
import {
  useBalancesContext,
  useNetworkContext,
  useTokensWithBalances,
} from '@core/ui';
import { FC, useState } from 'react';
import { AssetsErrorState } from '../../../AssetsErrorState';
import { useHistory, useLocation } from 'react-router-dom';
import { Assets } from './Assets';
import { GeneralTokenDetails } from '../GeneralTokenDetails';
import { TabName, XPChainsTabs } from '../XPChains/Tabs';
import { StyledXPChainDetails } from '../styled';

type Props = {
  networkId: number;
};
export const PchainDetails: FC<Props> = ({ networkId }) => {
  const history = useHistory();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTabFromParams = queryParams.get('pchainTab') as TabName;
  const [activeTab, setActiveTab] = useState<TabName>(
    activeTabFromParams ?? 'assets',
  );

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
    queryParams.set('pchainTab', newTab);
    history.push({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
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
