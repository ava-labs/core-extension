import { useEffect, useState } from 'react';

import {
  useNetworkContext,
  useNetworkFeeContext,
  useWalletContext,
} from '@core/ui';
import {
  Account,
  FungibleTokenBalance,
  isBtcCapableAccount,
  isBtcToken,
  isErc20Token,
  isEvmNativeToken,
  isAvmCapableAccount,
  isXChainToken,
  isPvmCapableAccount,
  isPChainToken,
  isSvmCapableAccount,
  isSolanaNativeToken,
  isSolanaSplToken,
} from '@core/types';

import { getEvmMaxAmount } from './lib';
import { getBtcMaxAmount } from './lib/getBtcMaxAmount';
import { getXChainMaxAmount } from './lib/getXChainMaxAmount';
import { getPChainMaxAmount } from './lib/getPChainMaxAmount';
import { getSolanaMaxAmount } from './lib/getSolanaMaxAmount';
import { useGetXPAddresses } from '../useGetXPAddresses';

type MaxAmountInfo = {
  maxAmount: bigint;
  estimatedFee: bigint;
};

export const useMaxAmountForTokenSend = (
  from?: Account,
  token?: FungibleTokenBalance,
  to?: string,
): MaxAmountInfo => {
  const { getNetwork } = useNetworkContext();
  const { getNetworkFee } = useNetworkFeeContext();
  const { isLedgerWallet } = useWalletContext();
  const getXPAddresses = useGetXPAddresses();

  const [result, setResult] = useState<MaxAmountInfo>({
    maxAmount: 0n,
    estimatedFee: 0n,
  });

  useEffect(() => {
    if (!token || !from) return;

    getNetworkFee(token.coreChainId)
      .then((networkFee) => {
        if (!networkFee) {
          return;
        }

        if (isEvmNativeToken(token) || isErc20Token(token)) {
          setResult(getEvmMaxAmount(networkFee, token));
        } else if (to && isBtcCapableAccount(from) && isBtcToken(token)) {
          getBtcMaxAmount(
            networkFee,
            token,
            from.addressBTC,
            to,
            getNetwork(token.coreChainId),
          ).then(setResult);
        } else if (isAvmCapableAccount(from) && isXChainToken(token)) {
          getXChainMaxAmount(
            from,
            isLedgerWallet,
            getXPAddresses('AVM'),
            getNetwork(token.coreChainId),
          ).then(setResult);
        } else if (isPvmCapableAccount(from) && isPChainToken(token)) {
          getPChainMaxAmount(
            from,
            isLedgerWallet,
            getXPAddresses('PVM'),
            getNetwork(token.coreChainId),
          ).then(setResult);
        } else if (
          isSvmCapableAccount(from) &&
          (isSolanaNativeToken(token) || isSolanaSplToken(token))
        ) {
          setResult(getSolanaMaxAmount(token));
        } else {
          setResult({
            maxAmount: 0n,
            estimatedFee: 0n,
          });
        }
      })
      .catch((error) => {
        console.error(
          'Error while estimating max send amount for token',
          token,
          error,
        );
      });
  }, [
    token,
    getNetworkFee,
    from,
    to,
    getNetwork,
    isLedgerWallet,
    getXPAddresses,
  ]);

  return result;
};
