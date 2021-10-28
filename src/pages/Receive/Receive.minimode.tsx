import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  CopyIcon,
  LoadingIcon,
  Card,
  HorizontalFlex,
  TextButton,
  IconDirection,
  CaretIcon,
} from '@avalabs/react-components';

import { useWalletContext } from '@src/contexts/WalletProvider';
import styled, { useTheme } from 'styled-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';
import { useHistory } from 'react-router';
import { truncateAddress } from '@src/utils/truncateAddress';

const AddressBlock = styled(Card)`
  background: transparent;
  cursor: pointer;
  margin: 24px 8px 0 8px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: solid 1px ${({ theme }) => theme.palette.grey['800']};
  width: 95%;

  & > ${Typography} {
    word-break: break-all;
  }
`;

const StyledQRCodeWithLogo = styled(QRCodeWithLogo)`
  margin: 32px 0 0 0;
`;

export const ReceiveMiniMode = () => {
  const { addresses } = useWalletContext();
  const [chain, setChain] = useState('C');
  const theme = useTheme();
  const history = useHistory();

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
    <VerticalFlex width={'100%'} height="496px" align={'center'}>
      <VerticalFlex height="48px" margin="24px 0" align="center">
        <HorizontalFlex width={'100%'} justify={'center'}>
          <TextButton
            style={{ position: 'fixed', left: '10px' }}
            onClick={() => {
              chain === 'X' ? setChain('C') : history.goBack();
            }}
          >
            <CaretIcon
              color={theme.palette.white}
              direction={IconDirection.LEFT}
            />
          </TextButton>
          <Typography as="h1" size={29} weight={600} margin={'0 0 10px 0'}>
            Receive Tokens
          </Typography>
        </HorizontalFlex>
        <Typography height="24px">
          This is your{' '}
          <Typography color={theme.colors.primary1}>{chain} chain</Typography>{' '}
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
      <StyledQRCodeWithLogo
        value={getAddress()}
        logoText={chain === 'C' ? 'C-Chain' : 'X-Chain'}
      />
      <AddressBlock
        onClick={() => {
          navigator.clipboard.writeText(getAddress());
        }}
      >
        <HorizontalFlex justify={'center'} width={'100%'}>
          <Typography width="255px" height="24px">
            {truncateAddress(getAddress(), 18)}
          </Typography>
        </HorizontalFlex>
        <CopyIcon height="16px" color={theme.colors.primary1} />
      </AddressBlock>
      <HorizontalFlex
        width={'100%'}
        justify={'center'}
        style={{ position: 'fixed', bottom: '20px' }}
      >
        <TextButton onClick={() => setChain('X')}>
          <Typography color={theme.colors.primary1}>
            Looking for X chain?
          </Typography>
        </TextButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
