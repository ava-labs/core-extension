import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { TransactionReceipt } from 'ethers';
import {
  assert,
  assertPresent,
  getProviderForNetwork,
  retry,
  RetryBackoffPolicy,
} from '@core/common';
import {
  CommonError,
  FeatureGates,
  FeatureVars,
  SecretType,
  SwapErrorCode,
} from '@core/types';
import { SwapSide } from '@paraswap/sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';
import { WAVAX_ADDRESS, WETH_ADDRESS } from './constants';
import { EvmSwapQuote, GetRateParams, SwapAdapter, SwapParams } from './models';
import { swapError } from './swap-utils';
import { MarkrProvider } from './providers/MarkrProvider';
import { WNativeProvider } from './providers/WNativeProvider';
import {
  NormalizedTransactionParams,
  SwapProvider,
  SwapProviders,
} from './types';
import { ParaswapProvider } from './providers/ParaswapProvider';

const getSwapProvider = (isSwapUseMarkrBlocked: boolean): SwapProvider =>
  isSwapUseMarkrBlocked ? ParaswapProvider : MarkrProvider;

const getSwapProviderByName = (name: string): SwapProvider => {
  switch (name) {
    case SwapProviders.PARASWAP:
      return ParaswapProvider;
    case SwapProviders.MARKR:
      return MarkrProvider;
    case SwapProviders.WNATIVE:
      return WNativeProvider;
    default:
      throw new Error(`Unsupported swap provider: ${name}`);
  }
};

export const useEvmSwap: SwapAdapter<EvmSwapQuote> = (
  { account, network, walletDetails },
  { onTransactionReceipt },
) => {
  const { request } = useConnectionContext();
  const { isFlagEnabled, selectFeatureFlag } = useFeatureFlagContext();
  const { isGaslessOn } = useNetworkFeeContext();

  const abortControllerRef = useRef<AbortController | null>(null);
  const [rpcProvider, setRpcProvider] = useState<JsonRpcBatchInternal>();

  useEffect(() => {
    let isMounted = true;

    if (network) {
      getProviderForNetwork(network)
        .then((prov) => {
          if (isMounted) {
            setRpcProvider(prov as JsonRpcBatchInternal);
          }
        })
        .catch(() => {
          if (isMounted) {
            setRpcProvider(undefined);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [network]);

  const getRate = useCallback(
    async ({
      srcToken,
      destToken,
      srcDecimals,
      destDecimals,
      srcAmount,
      swapSide,
      slippageTolerance,
      onUpdate,
    }: GetRateParams) => {
      if (!network || network.isTestnet) {
        throw swapError(CommonError.UnknownNetwork);
      }
      if (!account || !account.addressC) {
        throw swapError(CommonError.NoActiveAccount);
      }

      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      const isFromTokenNative = network.networkToken.symbol === srcToken;
      const isDestTokenNative = network.networkToken.symbol === destToken;
      const wrappableTokens = [WAVAX_ADDRESS, WETH_ADDRESS];

      if (
        (isFromTokenNative &&
          wrappableTokens.includes(destToken.toLowerCase())) ||
        (isDestTokenNative && wrappableTokens.includes(srcToken.toLowerCase()))
      ) {
        return WNativeProvider.getQuote(
          {
            fromTokenAddress: srcToken,
            toTokenAddress: destToken,
            amount: srcAmount,
            destination: swapSide || SwapSide.SELL,
            fromTokenDecimals: isFromTokenNative ? 18 : srcDecimals,
            toTokenDecimals: isDestTokenNative ? 18 : destDecimals,
            account,
            network,
            slippage: 0,
          },
          undefined,
        );
      }

      // abort previous request
      abortControllerRef.current?.abort();
      // create new AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const provider =
        swapSide === SwapSide.BUY
          ? ParaswapProvider
          : getSwapProvider(!isFlagEnabled(FeatureGates.SWAP_USE_MARKR));

      // TODO: markr provider should be used for buy side as well

      try {
        const quote = await provider.getQuote(
          {
            fromTokenAddress: srcToken,
            toTokenAddress: destToken,
            amount: srcAmount,
            destination: swapSide || SwapSide.SELL,
            fromTokenDecimals: isFromTokenNative ? 18 : srcDecimals,
            toTokenDecimals: isDestTokenNative ? 18 : destDecimals,
            account,
            network,
            slippage: Number(slippageTolerance),
            onUpdate,
          },
          controller.signal,
        );
        return quote;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('aborted')) {
            return undefined;
          }
        }
        throw swapError(CommonError.Unknown);
      }
    },
    [account, network, isFlagEnabled],
  );

  const swap = useCallback(
    async ({
      srcToken,
      destToken,
      srcDecimals,
      destDecimals,
      swapProvider,
      quote,
      amountIn,
      amountOut,
      slippage,
    }: SwapParams<EvmSwapQuote>) => {
      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      assertPresent(network, CommonError.NoActiveNetwork);
      assertPresent(account, CommonError.NoActiveAccount);
      assertPresent(rpcProvider, CommonError.Unknown);
      assert(!network.isTestnet, CommonError.UnknownNetwork);

      const signAndSend = (
        method: RpcMethod,
        txParams: [NormalizedTransactionParams],
        context?: Record<string, unknown>,
      ): Promise<string> =>
        request(
          {
            method,
            params: txParams,
          },
          {
            scope: network.caipId,
            context,
          },
        );

      // getting the swap provider by name because there is chance that
      // the markr can be blocked after the quote is fetched
      const provider = getSwapProviderByName(swapProvider);
      // Check if one click swap is enabled
      const isOneClickSwapEnabled = isFlagEnabled(FeatureGates.ONE_CLICK_SWAP);
      const isOneClickSwapSupported =
        walletDetails?.type === SecretType.Mnemonic ||
        walletDetails?.type === SecretType.Seedless ||
        walletDetails?.type === SecretType.PrivateKey;

      const userAddress = account.addressC;
      const txHash = await provider.swap({
        srcTokenAddress: srcToken,
        isSrcTokenNative: network.networkToken.symbol === srcToken,
        destTokenAddress: destToken,
        isDestTokenNative: network.networkToken.symbol === destToken,
        quote,
        slippage,
        network,
        provider: rpcProvider,
        signAndSend,
        userAddress,
        isSwapFeesEnabled: isFlagEnabled(FeatureGates.SWAP_FEES),
        isOneClickSwapEnabled: isOneClickSwapEnabled && isOneClickSwapSupported,
        markrSwapGasBuffer: parseFloat(
          selectFeatureFlag(FeatureVars.MARKR_SWAP_GAS_BUFFER),
        ),
        isGaslessOn,
      });

      retry<TransactionReceipt | null>({
        operation: async () => rpcProvider.getTransactionReceipt(txHash),
        isSuccess: (r): r is TransactionReceipt => !!r, // success when receipt is present (>= 1 confirmation)
        backoffPolicy: RetryBackoffPolicy.linearThenExponential(4, 1000),
        maxRetries: 20,
      }).then((receipt) => {
        const isSuccessful = Boolean(receipt?.status === 1);
        onTransactionReceipt({
          isSuccessful,
          txHash: txHash,
          chainId: network.chainId,
          userAddress,
          srcToken,
          destToken,
          srcAmount: amountIn,
          destAmount: amountOut,
          srcDecimals,
          destDecimals,
        });
      });
    },
    [
      request,
      account,
      network,
      rpcProvider,
      onTransactionReceipt,
      isFlagEnabled,
      selectFeatureFlag,
      walletDetails?.type,
      isGaslessOn,
    ],
  );

  return {
    getRate,
    swap,
  };
};
