import React from 'react';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
} from '@avalabs/react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { PortfolioFlow } from './components/Portfolio/PortfolioFlow';
import { SettingsMenuFlow } from '@src/components/settings/SettingsMenuFlow';
import { AccountSelectorFlow } from '@src/components/common/account/AccountSelectorFlow';
import { HomeSideBar } from './components/HomeSideBar';

const TABS_BOTTOM_PADDING = 16;

export function Home() {
  return (
    <Tabs>
      <HorizontalFlex align={'center'} justify={'space-between'}>
        <TabList $border={false}>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={700} size={18} color={'inherit'}>
              Portfolio
            </Typography>
          </Tab>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={700} size={18} color={'inherit'}>
              Buy
            </Typography>
          </Tab>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={700} size={18} color={'inherit'}>
              Earn
            </Typography>
          </Tab>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={700} size={18} color={'inherit'}>
              Studio
            </Typography>
          </Tab>
        </TabList>
        <HorizontalFlex align={'center'}>
          <AccountSelectorFlow />
          <SettingsMenuFlow />
        </HorizontalFlex>
      </HorizontalFlex>
      <HorizontalFlex>
        <VerticalFlex flex={3} margin={`${TABS_BOTTOM_PADDING}px 16px 0 0`}>
          <TabPanel>
            <PortfolioFlow />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </VerticalFlex>
        <HomeSideBar margin={`${TABS_BOTTOM_PADDING}px 0 0 0`} />
      </HorizontalFlex>
    </Tabs>
  );
}
