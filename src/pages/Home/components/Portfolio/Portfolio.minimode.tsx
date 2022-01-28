import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { ActivityFlow } from '@src/pages/Activity/ActivityFlow';
import { useState } from 'react';
import styled from 'styled-components';
import { TokenListMiniMode } from './TokenList.minimode';
import { WalletBalancesMiniMode } from './WalletBalances.minimode';

const Tabs = styled(HorizontalFlex)`
  border-bottom: ${({ theme }) => `1px solid ${theme.separator.color}`};
`;

const Tab = styled.button<{ selected?: boolean }>`
  border: none;
  background: transparent;
  width: 50%;
  cursor: pointer;
  padding: 8px 16px;
  border-bottom: ${({ selected, theme }) =>
    selected ? `2px solid ${theme.colors.text1}` : '2px solid transparent'}; ;
`;

const TabLabel = styled(Typography)<{ selected: boolean }>`
  font-size: 14px;
  line-height: 17px;
  font-weight: ${({ selected }) => (selected ? '500' : '400')};
  color: ${({ theme, selected }) =>
    selected ? theme.colors.text1 : theme.colors.text2};

  &:hover {
    color: ${({ theme }) => theme.colors.text1};
  }
`;

enum PortfolioTabs {
  ASSETS = 'ASSETS',
  ACTIVITY = 'ACTIVITY',
}

export function PortfolioMiniMode() {
  const [selectedTab, setSelectedTab] = useState<PortfolioTabs>(
    PortfolioTabs.ASSETS
  );

  return (
    <>
      <VerticalFlex margin="0 0 16px">
        <WalletBalancesMiniMode />
        <Tabs
          justify="center"
          align="center"
          marginTop="14px"
          padding="0 16px 0 16px"
        >
          <Tab
            selected={selectedTab === PortfolioTabs.ASSETS}
            onClick={() => setSelectedTab(PortfolioTabs.ASSETS)}
          >
            <TabLabel selected={selectedTab === PortfolioTabs.ASSETS}>
              Assets
            </TabLabel>
          </Tab>
          <Tab
            selected={selectedTab === PortfolioTabs.ACTIVITY}
            onClick={() => setSelectedTab(PortfolioTabs.ACTIVITY)}
          >
            <TabLabel selected={selectedTab === PortfolioTabs.ACTIVITY}>
              Activity
            </TabLabel>
          </Tab>
        </Tabs>
      </VerticalFlex>
      {selectedTab === PortfolioTabs.ASSETS && <TokenListMiniMode />}
      {selectedTab === PortfolioTabs.ACTIVITY && <ActivityFlow />}
    </>
  );
}
