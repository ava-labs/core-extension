import React, { useState } from 'react';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  Card,
  LoadingIcon,
} from '@avalabs/react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { WalletHomeSend } from '../Wallet/WalletHomeSend';
import { WalletHomeReceive } from '../Wallet/WalletHomeReceive';
import { WalletHomeRecentTxs } from '../Wallet/WalletHomeRecentTxs';
import { WalletPortfolio } from '../Wallet/WalletPortfolio';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useEffect } from 'react';
import { AccountSelector } from '@src/components/common/AccountSelector';

const TABS_BOTTOM_PADDING = 30;

function HomeSideBar() {
  const tokensWithBalances = useTokensWithBalances();
  const [showSend, setShowSend] = useState<boolean>();

  useEffect(() => {
    setShowSend(!!tokensWithBalances.length);
  }, [tokensWithBalances]);

  if (showSend === undefined) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex flex={1} margin={`${TABS_BOTTOM_PADDING}px 0 0 0`}>
      <Card>
        <Tabs defaultIndex={showSend ? 0 : 1}>
          <TabList>
            <Tab disabled={!showSend}>
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
      <HorizontalFlex align={'center'} justify={'space-between'}>
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
        <AccountSelector />
      </HorizontalFlex>
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
