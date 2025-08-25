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

  const [result, setResult] = useState<MaxAmountInfo>({
    maxAmount: 0n,
    estimatedFee: 0n,
  });

  useEffect(() => {
    if (!token || !from) return;

    let isMounted = true;

    getNetworkFee(token.coreChainId)
      .then((networkFee) => {
        if (!networkFee || !isMounted) {
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
          ).then((res) => isMounted && setResult(res));
        } else if (isAvmCapableAccount(from) && isXChainToken(token)) {
          getXChainMaxAmount(
            from,
            isLedgerWallet,
            getNetwork(token.coreChainId),
          ).then((res) => isMounted && setResult(res));
        } else if (isPvmCapableAccount(from) && isPChainToken(token)) {
          getPChainMaxAmount(
            from,
            isLedgerWallet,
            getNetwork(token.coreChainId),
          ).then((res) => isMounted && setResult(res));
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

    return () => {
      isMounted = false;
    };
  }, [token, getNetworkFee, from, to, getNetwork, isLedgerWallet]);

  return result;
};
