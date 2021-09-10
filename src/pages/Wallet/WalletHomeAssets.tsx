import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { Erc20TokenList } from './Erc20TokenList';

export function WalletHomeAssets() {
  return (
    <Card>
      <VerticalFlex width={'100%'}>
        <HorizontalFlex>
          <Typography size={18}>Assets</Typography>
        </HorizontalFlex>
        <br />
        <HorizontalFlex width={'100%'}>
          <Typography size={14} margin={'0 10px 0 0'}>
            Tokens
          </Typography>
          <Typography size={14}>Collectibles</Typography>
        </HorizontalFlex>
        <Erc20TokenList />
      </VerticalFlex>
    </Card>
  );
}
