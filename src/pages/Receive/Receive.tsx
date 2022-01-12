import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  CopyIcon,
  LoadingIcon,
  Card,
  toast,
} from '@avalabs/react-components';

import { useWalletContext } from '@src/contexts/WalletProvider';
import { SlideSelector } from '@src/components/common/SlideSelector';
import styled, { useTheme } from 'styled-components';
import { QRCodeWithLogo } from '@src/components/common/QRCodeWithLogo';

const AddressBlock = styled(Card)`
  background: ${({ theme }) => theme.colors.bg3};
  cursor: pointer;
  margin: 24px 0 0 0;
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
  const [chain, setChain] = useState<string>('C');
  const theme = useTheme();

  const getAddress = () => {
    return addresses.addrC;
  };

  if (!addresses || !addresses.addrC) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex width={'100%'} height="496px" align={'center'}>
      <VerticalFlex height="48px" margin="24px 0" align="center">
        <Typography height="24px">
          This is your{' '}
          <Typography color={theme.colors.primary1}>{chain} chain</Typography>{' '}
          address to receive funds
        </Typography>
      </VerticalFlex>
      <SlideSelector
        onChange={(value) => setChain(value)}
        items={[{ label: 'C Chain', value: 'C' }]}
      />
      <StyledQRCodeWithLogo value={getAddress()} logoText={'C-Chain'} />
      <AddressBlock
        onClick={() => {
          navigator.clipboard.writeText(getAddress());
          toast.success('Copied!');
        }}
      >
        <Typography width="255px" height="24px">
          {getAddress()}
        </Typography>
        <CopyIcon height="16px" color={theme.colors.primary1} />
      </AddressBlock>
    </VerticalFlex>
  );
};
