import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  CopyIcon,
  LoadingIcon,
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

interface ReceiveMiniModeProps {
  limitToChain?: 'C' | 'X';
  // indicates whether the page is used inside a tab or standalone
  // in embedded mode the title bar is hidden and the QR code size is reduced
  embedded?: boolean;
}

const AddressBlock = styled(HorizontalFlex)`
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border: solid 1px ${({ theme }) => theme.colors.stroke1};
  width: 100%;

  & > ${Typography} {
    word-break: break-all;
  }
`;

const StyledTextButton = styled(TextButton)`
  position: absolute;
  left: 0;
`;

export const ReceiveMiniMode = ({
  limitToChain,
  embedded = false,
}: ReceiveMiniModeProps) => {
  const { addresses } = useWalletContext();
  const [chain, setChain] = useState(limitToChain || 'C');
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
    <VerticalFlex
      width={'100%'}
      grow="1"
      align={'center'}
      padding={embedded ? '' : '16px'}
    >
      {!embedded && (
        <HorizontalFlex
          width={'100%'}
          align="center"
          justify={'center'}
          position="relative"
        >
          <StyledTextButton
            onClick={() => {
              chain === 'X' ? setChain('C') : history.goBack();
            }}
          >
            <CaretIcon
              height="24px"
              color={theme.colors.icon1}
              direction={IconDirection.LEFT}
            />
          </StyledTextButton>
          <Typography as="h1" size={24} height="29px" weight={600}>
            Receive Tokens
          </Typography>
        </HorizontalFlex>
      )}

      <VerticalFlex
        width={'100%'}
        height="40px"
        align="center"
        margin={embedded ? '0' : '24px 0 0'}
      >
        <Typography height="17px" size={14}>
          This is your{' '}
          <Typography weight={600} height="17px">
            {chain} chain
          </Typography>{' '}
          address to receive funds
        </Typography>
        {chain === 'X' && (
          <Typography height="17px" size={14}>
            Your address will change after every deposit
          </Typography>
        )}
      </VerticalFlex>

      <VerticalFlex width={'100%'} grow="1" align="center" justify="center">
        <QRCodeWithLogo
          size={embedded ? 120 : 183}
          value={getAddress()}
          logoText={chain === 'C' ? 'C-Chain' : 'X-Chain'}
        />
      </VerticalFlex>

      <AddressBlock
        onClick={() => {
          navigator.clipboard.writeText(getAddress());
        }}
      >
        <Typography height="24px">
          {truncateAddress(getAddress(), 18)}
        </Typography>
        <CopyIcon height="16px" color={theme.colors.icon1} />
      </AddressBlock>

      <HorizontalFlex
        height="24px"
        align="center"
        justify="center"
        margin={embedded ? '32px 0 16px' : '48px 0 16px'}
      >
        {!limitToChain &&
          (chain === 'C' ? (
            <TextButton onClick={() => setChain('X')}>
              <Typography color="inherit">Looking for X chain?</Typography>
            </TextButton>
          ) : (
            <TextButton onClick={() => setChain('C')}>
              <Typography color="inherit">Back</Typography>
            </TextButton>
          ))}
      </HorizontalFlex>
    </VerticalFlex>
  );
};
