import React from 'react';
import {
  VerticalFlex,
  LoadingIcon,
  HorizontalFlex,
  Typography,
  Card,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletHomeBalances } from './WalletHomeBalances';
import { WalletHomeAssets } from './WalletHomeAssets';
import { WalletHomeSend } from './WalletHomeSend';
import { WalletHomeReceive } from './WalletHomeReceive';
import { WalletHomeRecentTxs } from './WalletHomeRecentTxs';
import { WalletHomeTopBar } from './WalletHomeTopBar';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';

export function WalletHome() {
  const { balances, avaxPrice } = useWalletContext();

  if (!balances || !avaxPrice) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'}>
      <WalletHomeTopBar />
      <br />
      <HorizontalFlex>
        <VerticalFlex flex={3} margin={'0 10px 0 0'}>
          <WalletHomeBalances />
          <br />
          <WalletHomeAssets />
        </VerticalFlex>
        <VerticalFlex flex={1}>
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
      </HorizontalFlex>
    </VerticalFlex>
  );
}
