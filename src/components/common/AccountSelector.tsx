import {
  Card,
  HorizontalFlex,
  SubTextTypography,
  Typography,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { truncateAddress } from '@src/utils/truncateAddress';
import React from 'react';
import { TokenImg } from './TokenImage';

export function AccountSelector() {
  const { addresses } = useWalletContext();
  return (
    <Card width={'270px'} padding={'10px'}>
      <HorizontalFlex align={'center'}>
        <TokenImg
          src={
            'https://pbs.twimg.com/profile_images/1430767242606743557/G2DVOmov_400x400.jpg'
          }
        />
        <Typography margin={'0 10px'}>Account</Typography>
        <SubTextTypography>
          {truncateAddress(addresses.addrC)}
        </SubTextTypography>
      </HorizontalFlex>
    </Card>
  );
}
