import { isNil } from 'lodash';
import { ChainId } from '@avalabs/core-chains-sdk';
import { WAVAX_ADDRESS, WETH_ADDRESS } from '@core/ui';

import {
  FungibleTokenBalance,
  isErc20Token,
  isEvmFungibleToken,
  isEvmNativeToken,
  isSolanaFungibleToken,
} from '@core/types';

import { SwappableToken, SwapProvider } from '../../types';

export const getSwapProvider = (
  fromToken?: SwappableToken,
  toToken?: SwappableToken,
  useMarkr = true,
): SwapProvider => {
  if (isNil(fromToken) || isNil(toToken)) {
    return 'none';
  }

  if (isSolanaFungibleToken(fromToken) && isSolanaFungibleToken(toToken)) {
    return 'jupiter';
  }

  if (isNativeAvax(fromToken) && isWrappedAvax(toToken)) {
    return 'native-wrapper';
  }

  if (isWrappedAvax(fromToken) && isNativeAvax(toToken)) {
    return 'native-wrapper';
  }

  if (isNativeEth(fromToken) && isWrappedEth(toToken)) {
    return 'native-wrapper';
  }

  if (isWrappedEth(fromToken) && isNativeEth(toToken)) {
    return 'native-wrapper';
  }

  if (isEvmFungibleToken(fromToken) && isEvmFungibleToken(toToken)) {
    if (useMarkr) {
      return 'markr';
    }
    return 'paraswap';
  }
  return 'unsupported';
};

const isNativeAvax = (swapToken: FungibleTokenBalance) =>
  isEvmNativeToken(swapToken) &&
  swapToken.coreChainId === ChainId.AVALANCHE_MAINNET_ID;

const isNativeEth = (swapToken: FungibleTokenBalance) =>
  isEvmNativeToken(swapToken) &&
  swapToken.coreChainId === ChainId.ETHEREUM_HOMESTEAD;

const isWrappedAvax = (swapToken: FungibleTokenBalance) =>
  isErc20Token(swapToken) &&
  swapToken.coreChainId === ChainId.AVALANCHE_MAINNET_ID &&
  swapToken.address.toLowerCase() === WAVAX_ADDRESS.toLowerCase();

const isWrappedEth = (swapToken: FungibleTokenBalance) =>
  isErc20Token(swapToken) &&
  swapToken.coreChainId === ChainId.ETHEREUM_HOMESTEAD &&
  swapToken.address.toLowerCase() === WETH_ADDRESS.toLowerCase();
