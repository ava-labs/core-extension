import React, { useState } from 'react';
import { QRCode } from 'react-qr-svg';
import {
  VerticalFlex,
  Typography,
  CopyIcon,
  SecondaryCard,
  LoadingIcon,
  HorizontalFlex,
} from '@avalabs/react-components';

import { useWalletContext } from '@src/contexts/WalletProvider';
import { SlideSelector } from '@src/components/common/SlideSelector';
import { useTheme } from 'styled-components';

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
      <br />
      <Typography>Select Chain to 'Receive' your coin</Typography>
      <br />
      <SlideSelector
        onChange={(value) => setChain(value)}
        items={[
          { label: 'X Chain', value: 'X' },
          { label: 'C Chain', value: 'C' },
        ]}
      />

      <br />
      <br />

      <VerticalFlex align={'center'}>
        <QRCode value={getAddress()} style={{ width: '100px' }} />
        <br />
        <br />

        <SecondaryCard
          style={{ cursor: 'pointer' }}
          onClick={() => {
            navigator.clipboard.writeText(getAddress());
          }}
        >
          <HorizontalFlex justify={'space-between'} align={'center'}>
            <Typography style={{ maxWidth: '80%', wordBreak: 'break-word' }}>
              {getAddress()}
            </Typography>
            <CopyIcon color={theme.colors.white} />
          </HorizontalFlex>
        </SecondaryCard>
      </VerticalFlex>
      <br />
    </VerticalFlex>
  );
};
