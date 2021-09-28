import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { TokenList } from './TokenList';
import { Tab, TabList, TabPanel, Tabs } from '@src/components/common/Tabs';

export function WalletHomeAssets() {
  return (
    <Card>
      <VerticalFlex width={'100%'}>
        <HorizontalFlex>
          <Typography size={18}>Assets</Typography>
        </HorizontalFlex>
        <br />
        <Tabs>
          <TabList $border={false}>
            <Tab $highlight={false}>
              <Typography color={'inherit'} size={14}>
                Tokens
              </Typography>
            </Tab>
            <Tab $highlight={false}>
              <Typography color={'inherit'} size={14}>
                Collectibles
              </Typography>
            </Tab>
          </TabList>
          <TabPanel>
            <TokenList />
          </TabPanel>
          <TabPanel>Collectibles List</TabPanel>
        </Tabs>
      </VerticalFlex>
    </Card>
  );
}
