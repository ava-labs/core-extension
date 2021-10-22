import React from 'react';
import { LoadingIcon } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletBalances } from './WalletBalances';
import { WalletHomeAssets } from './WalletHomeAssets';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { WalletHomeAssetsMiniMode } from './WalletHomeAssets.minimode';

export function WalletPortfolio() {
  const { balances, avaxPrice } = useWalletContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  if (!balances || !avaxPrice) {
    return <LoadingIcon />;
  }

  return (
    <>
      <WalletBalances />
      <br />
      {isMiniMode ? <WalletHomeAssetsMiniMode /> : <WalletHomeAssets />}
    </>
  );
}
