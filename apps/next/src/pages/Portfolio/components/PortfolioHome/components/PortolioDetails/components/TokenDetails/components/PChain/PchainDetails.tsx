import { Stack, TabBar, TabBarItemProps, styled } from '@avalabs/k2-alpine';
import { isTokenWithBalancePVM } from '@core/common';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetsErrorState } from '../../../AssetsErrorState';
import { TabsContainer } from '@/pages/Portfolio/components/PortfolioHome/styled';
import { useHistory, useLocation } from 'react-router-dom';
import { Assets } from './Assets';
import { GeneralTokenDetails } from '../GeneralTokenDetails';

type TabName = 'assets' | 'activity';

// Custom TabBar where both tabs take 50% width (accounting for gap)
const PChainTabBar = styled(TabBar)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
    width: '100%',
  },
  '& .MuiTab-root': {
    flex: `1 1 calc(50% - ${theme.spacing(0.5)})`,
    minWidth: `calc(50% - ${theme.spacing(0.5)})`,
    maxWidth: `calc(50% - ${theme.spacing(0.5)})`,
    width: `calc(50% - ${theme.spacing(0.5)})`,
  },
}));

type Props = {
  networkId: number;
};
export const PchainDetails: FC<Props> = ({ networkId }) => {
  const { t } = useTranslation();
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

  const TABS: TabBarItemProps[] = [
    {
      id: 'assets',
      label: t('Assets'),
    },
    {
      id: 'activity',
      label: t('Activity'),
    },
  ];

  if (!_isCorrectBalance) {
    return <AssetsErrorState />;
  }

  return (
    <Stack gap={1}>
      <Stack display={activeTab === 'assets' ? 'flex' : 'none'}>
        <Assets balances={pchainToken} />
      </Stack>
      <Stack display={activeTab === 'activity' ? 'flex' : 'none'}>
        <GeneralTokenDetails networkId={networkId} tokenAddress={'AVAX'} />
      </Stack>

      <TabsContainer>
        <PChainTabBar
          tabBarItems={TABS}
          value={activeTab}
          onChange={(_, val) => {
            queryParams.set('pchainTab', val);
            history.push({
              pathname: location.pathname,
              search: queryParams.toString(),
            });
            setActiveTab(val as TabName);
          }}
          size="extension"
        />
      </TabsContainer>
    </Stack>
  );
};
