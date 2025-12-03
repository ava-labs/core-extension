import { Stack } from '@avalabs/k2-alpine';
import { isTokenWithBalanceAVM } from '@core/common';
import { useBalancesContext, useTokensWithBalances } from '@core/ui';
import { FC, useState } from 'react';
import { AssetsErrorState } from '../../../AssetsErrorState';
import { GeneralTokenDetails } from '../GeneralTokenDetails';
import { TabName, XPChainsTabs } from '../XPChains/Tabs';
import { Assets } from './Assets';
import { StyledXPChainDetails } from '../styled';
import { useUrlState } from '../../hooks/useUrlState';
import { NetworkWithCaipId } from '@core/types';

type Props = {
  networkId: number;
  network: NetworkWithCaipId;
};
export const XchainDetails: FC<Props> = ({ networkId, network }) => {
  const urlState = useUrlState();

  const initialTab = urlState.xpChainTab ?? 'assets';
  const [activeTab, setActiveTab] = useState<TabName>(initialTab);

  const { balances } = useBalancesContext();
  const xchainBalances = useTokensWithBalances({
    network,
  });

  // Get the X-chain native token (should be the first/only token for P-chain)
  const xchainToken = xchainBalances[0];
  const _isCorrectBalance = isTokenWithBalanceAVM(xchainToken);

  const activeTabOnSelect = (newTab: TabName) => {
    urlState.update(urlState.filter, networkId, 'AVAX', newTab);
    setActiveTab(newTab);
  };

  // Show nothing while balances are loading
  if (balances.loading) {
    return null;
  }

  // Show error state only after data has loaded but is invalid
  if (!_isCorrectBalance || !xchainToken) {
    return <AssetsErrorState />;
  }

  return (
    <>
      <StyledXPChainDetails>
        <Stack gap={1} display={activeTab === 'assets' ? 'flex' : 'none'}>
          <Assets balances={xchainToken} />
        </Stack>
        <Stack
          gap={1}
          display={activeTab === 'activity' ? 'flex' : 'none'}
          sx={{ flex: '1 1 auto' }}
        >
          <GeneralTokenDetails
            networkId={networkId}
            tokenAddress={'AVAX'}
            network={network}
          />
        </Stack>
      </StyledXPChainDetails>
      <XPChainsTabs activeTab={activeTab} setActiveTab={activeTabOnSelect} />
    </>
  );
};
