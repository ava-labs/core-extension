import { Stack } from '@avalabs/k2-alpine';
import { isTokenWithBalanceAVM } from '@core/common';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';
import { FC, useState } from 'react';
import { AssetsErrorState } from '../../../AssetsErrorState';
import { useHistory, useLocation } from 'react-router-dom';
import { GeneralTokenDetails } from '../GeneralTokenDetails';
import { TabName, XPChainsTabs } from '../XPChains/Tabs';
import { Assets } from './Assets';

type Props = {
  networkId: number;
};
export const XchainDetails: FC<Props> = ({ networkId }) => {
  const history = useHistory();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTabFromParams = queryParams.get('xchainTab') as TabName;
  const [activeTab, setActiveTab] = useState<TabName>(
    activeTabFromParams ?? 'assets',
  );

  const { getNetwork } = useNetworkContext();

  const network = getNetwork(networkId);

  const xchainBalances = useTokensWithBalances({
    network,
  });

  // Get the X-chain native token (should be the first/only token for P-chain)
  const xchainToken = xchainBalances[0];
  const _isCorrectBalance = isTokenWithBalanceAVM(xchainToken);

  const activeTabOnSelect = (newTab: TabName) => {
    queryParams.set('xchainTab', newTab);
    history.push({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
    setActiveTab(newTab);
  };

  if (!_isCorrectBalance || !xchainToken) {
    return <AssetsErrorState />;
  }

  return (
    <>
      <Stack sx={{ flex: '1 1 auto' }}>
        <Stack gap={1} display={activeTab === 'assets' ? 'flex' : 'none'}>
          <Assets balances={xchainToken} />
        </Stack>
        <Stack gap={1} display={activeTab === 'activity' ? 'flex' : 'none'}>
          <GeneralTokenDetails networkId={networkId} tokenAddress={'AVAX'} />
        </Stack>
      </Stack>
      <XPChainsTabs activeTab={activeTab} setActiveTab={activeTabOnSelect} />
    </>
  );
};
