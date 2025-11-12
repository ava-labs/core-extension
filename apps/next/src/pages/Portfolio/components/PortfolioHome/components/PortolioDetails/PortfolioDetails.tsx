import { FC } from 'react';
import { ActivityTab, AssetsTab, CollectiblesTab, DeFiTab } from './components';
import { PortfolioActionButtons } from './components/PortfolioActionButtons';
import { TabName } from '../../PortfolioHome';

type Props = {
  tab: TabName;
};

const tabComponents: Record<TabName, FC> = {
  assets: AssetsTab,
  collectibles: CollectiblesTab,
  defi: DeFiTab,
  activity: ActivityTab,
};

export const PortfolioDetails: FC<Props> = ({ tab }) => {
  const TabComponent = tabComponents[tab];

  return (
    <>
      <PortfolioActionButtons />
      <TabComponent />
    </>
  );
};
