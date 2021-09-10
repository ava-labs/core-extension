import React from 'react';
import {
  HorizontalFlex,
  TextButton,
  Typography,
} from '@avalabs/react-components';

export function WalletHomeTopBar() {
  return (
    <HorizontalFlex width={'100%'}>
      <TextButton margin={'0 20px 0 0'}>
        <Typography>Portfolio</Typography>
      </TextButton>
      <TextButton margin={'0 20px 0 0'}>
        <Typography>Buy</Typography>
      </TextButton>
      <TextButton margin={'0 20px 0 0'}>
        <Typography>Earn</Typography>
      </TextButton>
      <TextButton>
        <Typography>Studio</Typography>
      </TextButton>
    </HorizontalFlex>
  );
}
