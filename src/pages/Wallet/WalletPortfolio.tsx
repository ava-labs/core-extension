import React from 'react';
import { VerticalFlex, LoadingIcon } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletHomeBalances } from './WalletHomeBalances';
import { WalletHomeAssets } from './WalletHomeAssets';

export function WalletPortfolio() {
  const { balances, avaxPrice } = useWalletContext();

  if (!balances || !avaxPrice) {
    return <LoadingIcon />;
  }

  return (
    <>
      <WalletHomeBalances />
      <br />
      <WalletHomeAssets />
    </>
  );
}
