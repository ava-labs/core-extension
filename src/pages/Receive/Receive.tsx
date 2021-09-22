import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  CopyIcon,
  LoadingIcon,
  Card,
} from '@avalabs/react-components';

import { useWalletContext } from '@src/contexts/WalletProvider';
import { SlideSelector } from '@src/components/common/SlideSelector';
import styled, { useTheme } from 'styled-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';

const AddressBlock = styled(Card)`
  background: ${({ theme }) => theme.colors.grey[800]};
  cursor: pointer;
  margin: 48px 0 0 0;
  justify-content: space-between;
  align-items: center;
  padding: 16px;

  & > ${Typography} {
    word-break: break-all;
  }
`;

const StyledQRCodeWithLogo = styled(QRCodeWithLogo)`
  margin: 32px 0 0 0;
`;

export const Receive = () => {
  const { addresses } = useWalletContext();
  const [chain, setChain] = useState('C');
  const theme = useTheme();

  const getAddress = () => {
    if (chain === 'C') {
      return addresses.addrC;
    } else if (chain === 'X') {
      return addresses.addrX;
    } else if (chain === 'P') {
      return addresses.addrP;
    }
    return addresses.addrC;
  };

  if (!addresses || !addresses.addrC) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <VerticalFlex height="48px" margin="32px 0" align="center">
        <Typography height="24px">
          This is your{' '}
          <Typography color={theme.colors.primary[400]}>
            {chain} chain
          </Typography>{' '}
          address to receive funds
        </Typography>
        {chain === 'X' ? (
          <Typography height="24px">
            Your address will change after every deposit
          </Typography>
        ) : (
          ''
        )}
      </VerticalFlex>
      <SlideSelector
        onChange={(value) => setChain(value)}
        items={[
          { label: 'C Chain', value: 'C' },
          { label: 'X Chain', value: 'X' },
        ]}
      />
      <StyledQRCodeWithLogo
        value={getAddress()}
        logoText={chain === 'C' ? 'C-Chain' : 'X-Chain'}
      />
      <AddressBlock
        onClick={() => {
          navigator.clipboard.writeText(getAddress());
        }}
      >
        <Typography width="255px" height="24px">
          {getAddress()}
        </Typography>
        <CopyIcon size="16px" color={theme.colors.white} />
      </AddressBlock>
    </VerticalFlex>
  );
};
