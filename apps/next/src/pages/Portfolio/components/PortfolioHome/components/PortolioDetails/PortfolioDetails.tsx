import { TokenType } from '@avalabs/vm-module-types';
import { useLiveBalance } from '@core/ui';
import { ComponentType, FC } from 'react';
import { TabName } from '../../types';
import { ActivityTab, AssetsTab, CollectiblesTab, DeFiTab } from './components';
import { PortfolioActionButtons } from './components/PortfolioActionButtons';

type Props = {
  tab: TabName;
};

type TabConfig = {
  TabComponent: ComponentType;
  balancesFor: TokenType[];
};
const tabConfig: Record<TabName, TabConfig> = {
  assets: {
    TabComponent: AssetsTab,
    balancesFor: [TokenType.NATIVE, TokenType.ERC20],
  },
  collectibles: {
    TabComponent: CollectiblesTab,
    balancesFor: [TokenType.ERC721, TokenType.ERC1155],
  },
  defi: { TabComponent: DeFiTab, balancesFor: [] },
  activity: { TabComponent: ActivityTab, balancesFor: [] },
};

export const PortfolioDetails: FC<Props> = ({ tab }) => {
  const { TabComponent, balancesFor } = tabConfig[tab];
  useLiveBalance(balancesFor);

  return (
    <>
      <PortfolioActionButtons />
      <TabComponent />
    </>
  );
};
