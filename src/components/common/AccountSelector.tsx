import {
  HorizontalFlex,
  SecondaryCard,
  SubTextTypography,
  Typography,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { truncateAddress } from '@src/utils/truncateAddress';
import React from 'react';
import styled from 'styled-components';
import { TokenImg } from './TokenImage';

const AccountName = styled(Typography)`
  max-width: 165px;
  margin: 0 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
`;

export function AccountSelector() {
  const { addresses } = useWalletContext();
  return (
    <SecondaryCard width="max-content" padding={'8px'} margin="0 32px 0 0">
      <HorizontalFlex align={'center'}>
        <TokenImg
          src={
            'https://pbs.twimg.com/profile_images/1430767242606743557/G2DVOmov_400x400.jpg'
          }
        />
        <AccountName textOverflow="ellipsis" wrap="nowrap">
          Account
        </AccountName>
        <SubTextTypography size={14}>
          {truncateAddress(addresses.addrC)}
        </SubTextTypography>
      </HorizontalFlex>
    </SecondaryCard>
  );
}
