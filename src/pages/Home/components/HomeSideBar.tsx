import {
  Card,
  LoadingIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { Receive } from '@src/pages/Receive/Receive';
import { WalletHomeSend } from '@src/pages/Send/WalletHomeSend';
import { WalletRecentTxs } from '@src/pages/Wallet/WalletRecentTxs';
import React, { useEffect, useState } from 'react';

interface HomeSideBarProps {
  margin?: string;
}

const SIDEBAR_WIDTH = 391;

export function HomeSideBar({ margin }: HomeSideBarProps) {
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
      margin={margin}
      width={`${SIDEBAR_WIDTH}px`}
      style={{ minWidth: `${SIDEBAR_WIDTH}px` }}
    >
      <Card margin="0 0 16px">
        <Tabs defaultIndex={showSend ? 0 : 1}>
          <TabList $border={false}>
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
            <Receive />
          </TabPanel>
        </Tabs>
      </Card>
      <WalletRecentTxs />
    </VerticalFlex>
  );
}
