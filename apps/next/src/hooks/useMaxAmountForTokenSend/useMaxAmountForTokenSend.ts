import { useEffect, useMemo, useState } from 'react';

import {
  useNetworkContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';
import {
  Account,
  BtcTokenBalance,
  NetworkFee,
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
import { getSolanaMaxAmount } from './lib/getSolanaMaxAmount';
import { usePChainMaxAmount } from './usePChainMaxAmount';
import { getDefaultFeePreset } from '@/utils/getDefaultFeePreset';

import { usePolledNetworkFee } from './usePolledNetworkFee';
import { useGetXPAddresses } from '../useGetXPAddresses';

type MaxAmountInfo = {
  maxAmount: bigint | undefined;
  estimatedFee: bigint | undefined;
  networkFee: NetworkFee | null;
  isCalculating: boolean;
};

type MaxAmountResult = Pick<MaxAmountInfo, 'maxAmount' | 'estimatedFee'>;

export const useMaxAmountForTokenSend = (
  from?: Account,
  token?: FungibleTokenBalance,
  to?: string,
): MaxAmountInfo => {
  const { getNetwork } = useNetworkContext();
  const { isLedgerWallet } = useWalletContext();
  const getXPAddresses = useGetXPAddresses();
  const { filterSmallUtxos } = useSettingsContext();

  const [settled, setSettled] = useState<{
    inputs: object;
    result: MaxAmountResult;
  }>();
  const isPvmSend = Boolean(
    from && isPvmCapableAccount(from) && token && isPChainToken(token),
  );

  // P-Chain is handled by a cached query (heavy UTXO packing) instead of the effect below.
  const pChainMaxAmount = usePChainMaxAmount({
    from: from && isPvmCapableAccount(from) ? from : undefined,
    token: token && isPChainToken(token) ? token : undefined,
    network: token ? getNetwork(token.coreChainId) : undefined,
    isLedgerWallet,
    filterSmallUtxos,
    getAddresses: getXPAddresses('PVM'),
  });

  const isEvmSend = Boolean(
    token && (isEvmNativeToken(token) || isErc20Token(token)),
  );
  const isBtcSend = Boolean(
    to && from && token && isBtcCapableAccount(from) && isBtcToken(token),
  );
  const isXChainSend = Boolean(
    !isEvmSend &&
      !isBtcSend &&
      from &&
      token &&
      isAvmCapableAccount(from) &&
      isXChainToken(token),
  );

  const networkFee = usePolledNetworkFee(
    isEvmSend || isBtcSend ? token?.coreChainId : undefined,
  );

  const syncResult = useMemo<MaxAmountResult | undefined>(() => {
    if (!token || !from || isPvmSend || isBtcSend || isXChainSend) {
      return undefined;
    }

    if (isEvmSend) {
      const network = getNetwork(token.coreChainId);

      return network && networkFee
        ? getEvmMaxAmount(networkFee, token, getDefaultFeePreset(network))
        : undefined;
    }

    if (
      isSvmCapableAccount(from) &&
      (isSolanaNativeToken(token) || isSolanaSplToken(token))
    ) {
      return getSolanaMaxAmount(token);
    }

    return { maxAmount: 0n, estimatedFee: 0n };
  }, [
    token,
    from,
    isPvmSend,
    isBtcSend,
    isXChainSend,
    isEvmSend,
    getNetwork,
    networkFee,
  ]);

  // Fee refreshes re-run the BTC calculation but keep the previous result
  // until the new one lands, so they are deliberately not part of the key.
  const btcRecipient = isBtcSend ? to : null;
  const asyncInputs = useMemo(
    () => ({}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      token,
      from,
      btcRecipient,
      getNetwork,
      isLedgerWallet,
      getXPAddresses,
      filterSmallUtxos,
    ],
  );

  useEffect(() => {
    if (!token || !from || (!isBtcSend && !isXChainSend)) return;

    let isStale = false;
    const apply = (value: MaxAmountResult) => {
      if (!isStale) {
        setSettled({ inputs: asyncInputs, result: value });
      }
    };
    const onError = (error: unknown) => {
      console.error(
        'Error while estimating max send amount for token',
        token,
        error,
      );
    };

    if (isBtcSend) {
      if (!btcRecipient || !networkFee || !isBtcCapableAccount(from)) return;

      getBtcMaxAmount(
        networkFee,
        token as BtcTokenBalance,
        from.addressBTC,
        btcRecipient,
        getNetwork(token.coreChainId),
      )
        .then(apply)
        .catch(onError);
    } else if (isAvmCapableAccount(from)) {
      getXChainMaxAmount(
        from,
        isLedgerWallet,
        filterSmallUtxos,
        getXPAddresses('AVM'),
        getNetwork(token.coreChainId),
      )
        .then(apply)
        .catch(onError);
    }

    return () => {
      isStale = true;
    };
  }, [
    asyncInputs,
    token,
    from,
    btcRecipient,
    networkFee,
    isBtcSend,
    isXChainSend,
    getNetwork,
    isLedgerWallet,
    getXPAddresses,
    filterSmallUtxos,
  ]);

  if (isPvmSend) {
    return {
      ...pChainMaxAmount,
      networkFee,
      isCalculating: pChainMaxAmount.maxAmount === undefined,
    };
  }

  const current =
    syncResult ??
    (settled?.inputs === asyncInputs ? settled.result : undefined);

  return {
    maxAmount: current?.maxAmount,
    estimatedFee: current?.estimatedFee,
    networkFee,
    isCalculating: current === undefined,
  };
};
