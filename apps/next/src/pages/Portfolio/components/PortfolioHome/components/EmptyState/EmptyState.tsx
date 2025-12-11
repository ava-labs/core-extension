import { ComponentType, FC } from 'react';
import { AssetsTab } from './components/AssetsTab';
import { TokenType } from '@avalabs/vm-module-types';
import { CollectiblesTab } from '../PortolioDetails/components/CollectiblesTab';
import { DeFiTab } from '../PortolioDetails/components/DeFiTab';
import { TabName } from '../../types';

type Props = {
  tab: TabName;
};

type TabConfig = {
  TabComponent: ComponentType;
  balancesFor: TokenType[];
};
const tabConfig: Record<Exclude<TabName, 'activity'>, TabConfig> = {
  assets: {
    TabComponent: AssetsTab,
    balancesFor: [TokenType.NATIVE, TokenType.ERC20],
  },
  collectibles: {
    TabComponent: CollectiblesTab,
    balancesFor: [TokenType.ERC721, TokenType.ERC1155],
  },
  defi: { TabComponent: DeFiTab, balancesFor: [] },
};

export const EmptyState: FC<Props> = ({ tab }) => {
  const { TabComponent } = tabConfig[tab ?? 'assets'];
  return <TabComponent />;
};
