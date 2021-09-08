import React, { useState } from 'react';
import { QRCode } from 'react-qr-svg';
import { Link } from 'react-router-dom';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  HorizontalFlex,
  SecondaryButton,
  LoadingIcon,
} from '@avalabs/react-components';

import { truncateAddress } from '@src/utils/truncateAddress';
import { useWalletContext } from '@src/contexts/WalletProvider';

export const Deposit = () => {
  // const { addresses } = useWalletContext();
  const [isCopied, setIsCopied] = useState(false);
  const [chain, setChain] = useState('C');

  const getAddress = () => {
    // if (chain === 'C') {
    //   return addresses.addressC;
    // } else if (chain === 'X') {
    //   return addresses.addressX;
    // } else if (chain === 'P') {
    //   return addresses.addressP;
    // }
    // return addresses.addressC;
  };

  // const truncatedAddress = truncateAddress(getAddress());

  // if (!addresses || !addresses.addressC) {
  //   return <LoadingIcon />;
  // }

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <Typography>Select Chain to &apos;Receive&apos; your coin</Typography>
      <br />
      <HorizontalFlex>
        <PrimaryButton disabled={chain === 'X'} onClick={() => setChain('X')}>
          X-Chain
        </PrimaryButton>
        <PrimaryButton disabled={chain === 'P'} onClick={() => setChain('P')}>
          P-Chain
        </PrimaryButton>
        <PrimaryButton disabled={chain === 'C'} onClick={() => setChain('C')}>
          C-Chain
        </PrimaryButton>
      </HorizontalFlex>
      <br />
      <br />

      <VerticalFlex align={'center'}>
        {/* <QRCode value={getAddress()} style={{ width: '100px' }} />
        <br />
        <Typography>{truncatedAddress}</Typography>
        <br />

        <SecondaryButton
          onClick={() => {
            setIsCopied(true);
            navigator.clipboard.writeText(getAddress());
          }}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </SecondaryButton> */}
      </VerticalFlex>
      <br />
      <VerticalFlex align={'center'}>
        <Typography>Disclaimer</Typography>
        <Typography>
          This address can only be used to receive AVAX on the {chain} Chain.
        </Typography>
      </VerticalFlex>
      <br />

      <Link to="/wallet">
        <PrimaryButton>Close</PrimaryButton>
      </Link>
    </VerticalFlex>
  );
};
