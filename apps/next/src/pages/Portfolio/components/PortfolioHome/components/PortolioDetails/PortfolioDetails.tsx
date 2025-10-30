import { FC } from 'react';
import type { TabName } from '../NavigationBar';
import { ActivityTab, AssetsTab, DeFiTab, CollectiblesTab } from './components';
import { PortfolioActionButtons } from './components/PortfolioActionButtons';

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
