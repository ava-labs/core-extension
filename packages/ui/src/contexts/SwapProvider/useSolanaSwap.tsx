import { useCallback } from 'react';
import { SwapSide } from '@paraswap/sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { signature } from '@solana/kit';
import { wait } from '@avalabs/core-utils-sdk';
import { isSolanaProvider } from '@avalabs/core-wallets-sdk';

import { assert, assertPresent } from '@core/common';
import { AccountError, CommonError, SwapErrorCode } from '@core/types';
import { getProviderForNetwork } from '@core/common';
import { FeatureGates } from '@core/types';

import { useAnalyticsContext } from '../AnalyticsProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';

import {
  getJupiterFeeAccount,
  swapError,
  validateJupiterParams,
} from './swap-utils';
import {
  GetRateParams,
  JupiterQuote,
  SvmSwapQuote,
  SwapAdapter,
  SwapParams,
} from './models';
import { JupiterProvider } from './providers/JupiterProvider';
import { NormalizedTransactionParams } from './types';

export const useSolanaSwap: SwapAdapter<SvmSwapQuote> = (
  { account, network },
  { onTransactionReceipt, showPendingToast },
) => {
  const { request } = useConnectionContext();
  const { capture } = useAnalyticsContext();
  const { isFlagEnabled } = useFeatureFlagContext();

  const waitForTransaction = useCallback(
    async (txHash: string) => {
      assertPresent(network, CommonError.NoActiveNetwork);

      const provider = await getProviderForNetwork(network);

      if (!isSolanaProvider(provider)) {
        throw swapError(CommonError.MismatchingProvider);
      }

      const tx = await provider
        .getTransaction(signature(txHash), {
          encoding: 'jsonParsed',
          commitment: 'confirmed', // TODO: should we use 'finalized' here for max. certainty?
          maxSupportedTransactionVersion: 0,
        })
        .send();

      if (!tx) {
        await wait(500);
        return waitForTransaction(txHash);
      }

      if (tx.meta?.err) {
        return {
          success: false,
          error: tx.meta.err,
        };
      }

      return {
        success: true,
        error: null,
      };
    },
    [network],
  );

  const getRate = useCallback(
    async ({
      srcToken,
      destToken,
      swapSide,
      srcAmount,
      slippageTolerance,
      fromTokenBalance,
    }: GetRateParams) => {
      assertPresent(network, CommonError.NoActiveNetwork);
      assert(!network.isTestnet, CommonError.UnknownNetwork);

      if (
        !isFlagEnabled(FeatureGates.SWAP_SOLANA) ||
        !isFlagEnabled(FeatureGates.SWAP)
      ) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      try {
        return JupiterProvider.getQuote({
          fromTokenAddress: srcToken,
          fromTokenBalance,
          toTokenAddress: destToken,
          amount: String(srcAmount),
          destination: swapSide || SwapSide.SELL,
          slippage: Number(slippageTolerance),
          network,
          account,
          isSwapFeesEnabled: isFlagEnabled(FeatureGates.SWAP_FEES_JUPITER),
        });
      } catch (error) {
        console.error('Error getting rate', error);
        throw swapError(CommonError.Unknown);
      }
    },
    [account, network, isFlagEnabled],
  );

  const swap = useCallback(
    async (params: SwapParams<JupiterQuote>) => {
      assertPresent(account, CommonError.NoActiveAccount);
      assertPresent(network, CommonError.NoActiveNetwork);

      if (
        !isFlagEnabled(FeatureGates.SWAP_SOLANA) ||
        !isFlagEnabled(FeatureGates.SWAP)
      ) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      const userPublicKey = account.addressSVM;
      assertPresent(userPublicKey, AccountError.SVMAddressNotFound);

      const {
        srcToken,
        destToken,
        srcAmount,
        destAmount,
        srcDecimals,
        destDecimals,
        quote,
      } = validateJupiterParams(params);

      const provider = await getProviderForNetwork(network);

      if (!isSolanaProvider(provider)) {
        throw swapError(CommonError.MismatchingProvider);
      }

      const feeAccount = await getJupiterFeeAccount(
        isFlagEnabled(FeatureGates.SWAP_FEES_JUPITER),
        quote,
        provider,
        (mint) =>
          capture('SolanaSwapFeeAccountNotInitialized', {
            mint,
          }),
      );

      const signAndSend = (
        method: RpcMethod,
        txParams: [NormalizedTransactionParams],
      ): Promise<string> =>
        request(
          {
            method,
            params: txParams,
          },
          {
            scope: network.caipId,
          },
        );

      const txHash = await JupiterProvider.swap({
        srcTokenAddress: srcToken,
        srcTokenDecimals: srcDecimals,
        destTokenAddress: destToken,
        destTokenDecimals: destDecimals,
        quote,
        provider,
        userAddress: userPublicKey,
        signAndSend,
        isSwapFeesEnabled: isFlagEnabled(FeatureGates.SWAP_FEES_JUPITER),
        feeAccount,
        isOneClickSwapEnabled: false,
      });

      const pendingToastId = showPendingToast();

      waitForTransaction(txHash).then(({ success, error }) => {
        if (error) {
          console.error(error);
        }

        onTransactionReceipt({
          isSuccessful: success,
          pendingToastId,
          userAddress: userPublicKey,
          txHash: txHash,
          chainId: network.chainId,
          srcToken,
          destToken,
          srcAmount,
          destAmount,
          srcDecimals,
          destDecimals,
        });
      });
    },
    [
      account,
      network,
      request,
      capture,
      onTransactionReceipt,
      waitForTransaction,
      showPendingToast,
      isFlagEnabled,
    ],
  );

  return {
    getRate,
    swap,
  };
};
