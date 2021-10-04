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
import { AccountSelector } from '@src/components/common/account/AccountSelector';
import { SettingsMenu } from '@src/components/settings/SettingsMenu';

const TABS_BOTTOM_PADDING = 16;
const SIDEBAR_WIDTH = 391;

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
    <VerticalFlex
      flex={1}
      margin={`${TABS_BOTTOM_PADDING}px 0 0 0`}
      style={{ width: `${SIDEBAR_WIDTH}px`, minWidth: `${SIDEBAR_WIDTH}px` }}
    >
      <Card>
        <Tabs defaultIndex={showSend ? 0 : 1}>
          <TabList>
            <Tab disabled={!showSend}>
              <Typography weight={600} color={'inherit'}>
                Send
              </Typography>
            </Tab>
            <Tab>
              <Typography weight={600} color={'inherit'}>
                Receive
              </Typography>
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
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={600} color={'inherit'}>
              Portfolio
            </Typography>
          </Tab>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={600} color={'inherit'}>
              Buy
            </Typography>
          </Tab>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={600} color={'inherit'}>
              Earn
            </Typography>
          </Tab>
          <Tab $highlight={false} margin="0 40px 0 0">
            <Typography weight={600} color={'inherit'}>
              Studio
            </Typography>
          </Tab>
        </TabList>
        <HorizontalFlex align={'center'}>
          <AccountSelector />
          <SettingsMenu />
        </HorizontalFlex>
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
