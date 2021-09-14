import React from 'react';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  Card,
} from '@avalabs/react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { WalletHomeSend } from '../Wallet/WalletHomeSend';
import { WalletHomeReceive } from '../Wallet/WalletHomeReceive';
import { WalletHomeRecentTxs } from '../Wallet/WalletHomeRecentTxs';
import { WalletPortfolio } from '../Wallet/WalletPortfolio';

const TABS_BOTTOM_PADDING = 30;
function HomeSideBar() {
  return (
    <VerticalFlex
      flex={1}
      padding={`${TABS_BOTTOM_PADDING}px 0 0 0`}
      width={'350px'}
    >
      <Card>
        <Tabs>
          <TabList>
            <Tab>
              <Typography color={'inherit'}>Send</Typography>
            </Tab>
            <Tab>
              <Typography color={'inherit'}>Receive</Typography>
            </Tab>
          </TabList>

          <TabPanel>
            <WalletHomeSend />
          </TabPanel>
          <TabPanel>
            <WalletHomeReceive />
          </TabPanel>
        </Tabs>
      </Card>
      <br />
      <WalletHomeRecentTxs />
    </VerticalFlex>
  );
}

export function Home() {
  return (
    <Tabs>
      <TabList $border={false}>
        <Tab $highlight={false}>
          <Typography color={'inherit'}>Portfolio</Typography>
        </Tab>
        <Tab $highlight={false}>
          <Typography color={'inherit'}>Buy</Typography>
        </Tab>
        <Tab $highlight={false}>
          <Typography color={'inherit'}>Earn</Typography>
        </Tab>
        <Tab $highlight={false}>
          <Typography color={'inherit'}>Studio</Typography>
        </Tab>
      </TabList>
      <HorizontalFlex>
        <VerticalFlex flex={3} margin={`${TABS_BOTTOM_PADDING}px 10px 0 0`}>
          <TabPanel>
            <WalletPortfolio />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </VerticalFlex>
        <HomeSideBar />
      </HorizontalFlex>
    </Tabs>
  );
}
