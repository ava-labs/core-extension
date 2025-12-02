import { Stack } from '@avalabs/k2-alpine';
import { isTokenWithBalancePVM } from '@core/common';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';
import { FC, useState } from 'react';
import { AssetsErrorState } from '../../../AssetsErrorState';
import { useHistory, useLocation } from 'react-router-dom';
import { Assets } from './Assets';
import { GeneralTokenDetails } from '../GeneralTokenDetails';
import { TabName, XPChainsTabs } from '../XPChains/Tabs';

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

  if (!_isCorrectBalance || !pchainToken) {
    return <AssetsErrorState />;
  }

  return (
    <Stack height="100%" sx={{ overflowY: 'auto' }}>
      <Stack gap={1} display={activeTab === 'assets' ? 'flex' : 'none'}>
        <Assets balances={pchainToken} />
      </Stack>
      <Stack gap={1} display={activeTab === 'activity' ? 'flex' : 'none'}>
        <GeneralTokenDetails networkId={networkId} tokenAddress={'AVAX'} />
      </Stack>
      <XPChainsTabs activeTab={activeTab} setActiveTab={activeTabOnSelect} />
    </Stack>
  );
};
