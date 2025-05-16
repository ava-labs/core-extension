import { useCallback } from 'react';
import { SwapSide } from '@paraswap/sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { signature } from '@solana/kit';
import { resolve, wait } from '@avalabs/core-utils-sdk';
import { useTranslation } from 'react-i18next';
import { isSolanaProvider } from '@avalabs/core-wallets-sdk';

import { assert, assertPresent } from '@src/utils/assertions';
import { fetchAndVerify } from '@src/utils/fetchAndVerify';
import { isUserRejectionError } from '@src/utils/errors';
import { AccountError, CommonError } from '@src/utils/errors';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { FeatureGates } from '@src/background/services/featureFlags/models';

import { useAnalyticsContext } from '../AnalyticsProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';

import { JUPITER_PARTNER_FEE_BPS, SOL_MINT } from './constants';
import {
  getJupiterFeeAccount,
  swapError,
  validateJupiterParams,
} from './swap-utils';
import { JUPITER_QUOTE_SCHEMA, JUPITER_TX_SCHEMA } from './schemas';
import {
  GetRateParams,
  JupiterQuote,
  SwapAdapter,
  SwapErrorCode,
  SwapParams,
} from './models';

export const useSolanaSwap: SwapAdapter<
  JupiterQuote,
  SwapParams<JupiterQuote>
> = ({ account, network }, { onTransactionReceipt, showPendingToast }) => {
  const { t } = useTranslation();
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

      const isSelling = swapSide === SwapSide.SELL;
      const inputMint =
        srcToken === network.networkToken.symbol ? SOL_MINT : srcToken;
      const outputMint =
        destToken === network.networkToken.symbol ? SOL_MINT : destToken;
      const swapMode = isSelling ? 'ExactIn' : 'ExactOut';
      const amount = String(srcAmount);

      // In the UI, slippage is provided as %. We need to convert it into basis points for Jupiter:
      const slippageBps = Number(slippageTolerance) * 100;

      if (Number.isNaN(slippageBps)) {
        return {
          quote: null,
          error: {
            message: t('Invalid slippage tolerance'),
          },
        };
      }

      const feeParams = isFlagEnabled(FeatureGates.SWAP_FEES_JUPITER)
        ? { platformFeeBps: JUPITER_PARTNER_FEE_BPS.toString() }
        : undefined;

      const params = new URLSearchParams({
        inputMint,
        outputMint,
        swapMode,
        amount,
        slippageBps: Math.round(slippageBps).toString(),
        ...feeParams,
      });

      try {
        const data = await fetchAndVerify(
          [getUrl('quote', params)],
          JUPITER_QUOTE_SCHEMA,
        ).catch((error) => {
          console.error('Unable to get swap quote from Jupiter', error);
          throw swapError(SwapErrorCode.UnexpectedApiResponse);
        });

        if (
          typeof fromTokenBalance === 'bigint' &&
          fromTokenBalance < BigInt(data.inAmount)
        ) {
          return {
            quote: null,
            error: { message: t('Insufficient balance') },
            destAmount: undefined,
          };
        }

        return {
          quote: data,
          error: undefined,
          destAmount: isSelling ? data.outAmount : data.inAmount,
        };
      } catch (error) {
        console.error('Unable to get swap quote from Jupiter', error);
        return {
          quote: null,
          error: { message: t('Failed to fetch the swap quote') },
          destAmount: undefined,
        };
      }
    },
    [network, t, isFlagEnabled],
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

      const [txResponse, buildTxError] = await resolve(
        fetchAndVerify(
          [
            getUrl('swap'),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                quoteResponse: quote,
                userPublicKey,
                dynamicComputeUnitLimit: true, // Gives us a higher chance of the transaction landing
                feeAccount,
              }),
            },
          ],
          JUPITER_TX_SCHEMA,
        ),
      );

      if (!txResponse || buildTxError) {
        throw swapError(SwapErrorCode.CannotBuildTx, buildTxError);
      }

      // The /swap endpoint may return errors, as it attempts to simulate the transaction too.
      if (txResponse.simulationError) {
        throw swapError(
          SwapErrorCode.TransactionError,
          txResponse.simulationError,
        );
      }

      const [txHash, signError] = await resolve(
        request({
          method: RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
          params: [
            {
              account: userPublicKey,
              serializedTx: txResponse.swapTransaction,
            },
          ],
        }),
      );

      if (isUserRejectionError(signError)) {
        throw signError;
      } else if (signError || !txHash) {
        throw swapError(CommonError.UnableToSign, signError);
      }

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

const JUPITER_BASE_URL = 'https://lite-api.jup.ag/swap/v1';

const getUrl = (path: string, queryParams?: URLSearchParams) => {
  const queryString =
    queryParams && queryParams?.size > 0 ? `?${queryParams.toString()}` : '';

  return `${JUPITER_BASE_URL}/${path}${queryString}`;
};
