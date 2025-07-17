import {
  GetQuoteParams,
  NormalizedSwapQuote,
  NormalizedSwapQuoteResult,
  PerformSwapParams,
  SwapProvider,
  SwapProviders,
} from '../types';
import { swapError } from '../swap-utils';
import { AccountError, CommonError, SwapErrorCode } from '@core/types';
import { isJupiterQuote, SwapWalletState } from '../models';
import { JUPITER_PARTNER_FEE_BPS, SOL_MINT } from '../constants';
import {
  assert,
  assertPresent,
  fetchAndVerify,
  isUserRejectionError,
  resolve,
} from '@core/common';
import { SwapSide } from '@paraswap/sdk';
import { JUPITER_QUOTE_SCHEMA, JUPITER_TX_SCHEMA } from '../schemas';
import { isSolanaProvider } from '@avalabs/core-wallets-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';

// TODO: move services to a separate file

const JUPITER_BASE_URL = 'https://lite-api.jup.ag/swap/v1';

const getUrl = (path: string, queryParams?: URLSearchParams) => {
  const queryString =
    queryParams && queryParams?.size > 0 ? `?${queryParams.toString()}` : '';

  return `${JUPITER_BASE_URL}/${path}${queryString}`;
};

export const JupiterProvider: SwapProvider = {
  name: SwapProviders.JUPITER,

  async getQuote({
    fromTokenAddress,
    fromTokenBalance,
    toTokenAddress,
    amount,
    destination,
    slippage,
    network,
    isSwapFeesEnabled,
  }: GetQuoteParams & SwapWalletState): Promise<
    NormalizedSwapQuoteResult | undefined
  > {
    assertPresent(network, CommonError.NoActiveNetwork);
    assert(!network.isTestnet, CommonError.UnknownNetwork);

    const isSelling = destination === SwapSide.SELL;
    const inputMint =
      fromTokenAddress === network.networkToken.symbol
        ? SOL_MINT
        : fromTokenAddress;
    const outputMint =
      toTokenAddress === network.networkToken.symbol
        ? SOL_MINT
        : toTokenAddress;
    const swapMode = isSelling ? 'ExactIn' : 'ExactOut';

    // In the UI, slippage is provided as %. We need to convert it into basis points for Jupiter:
    const slippageBps = Number(slippage) * 100;

    if (Number.isNaN(slippageBps)) {
      throw swapError(SwapErrorCode.InvalidSlippageTolerance);
    }

    const feeParams = isSwapFeesEnabled
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
        throw swapError(SwapErrorCode.InsufficientBalance);
      }

      const quote: NormalizedSwapQuote = {
        quote: data,
        metadata: {
          amountIn: data.inAmount,
          amountOut: data.outAmount,
        },
      };

      return {
        provider: this.name,
        quotes: [quote],
        selected: quote,
      };
    } catch (error) {
      console.error('Unable to get swap quote from Jupiter', error);
      throw swapError(SwapErrorCode.UnexpectedApiResponse);
    }
  },

  async swap({
    srcTokenAddress,
    srcTokenDecimals,
    destTokenAddress,
    destTokenDecimals,
    quote,
    slippage,
    provider,
    account,
    network,
    signAndSend,
    isSwapFeesEnabled,
    feeAccount,
  }: PerformSwapParams & SwapWalletState) {
    assertPresent(account, CommonError.NoActiveAccount);
    assertPresent(network, CommonError.NoActiveNetwork);

    if (!srcTokenAddress)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: srcToken'),
      );
    if (!destTokenAddress)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: destToken'),
      );
    if (!srcTokenDecimals)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: srcDecimals'),
      );
    if (!destTokenDecimals)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: destDecimals'),
      );
    if (!quote)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: quote'),
      );
    if (!slippage)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: slippage'),
      );
    if (isSwapFeesEnabled && !feeAccount)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: feeAccount'),
      );

    const userPublicKey = account.addressSVM;
    assertPresent(userPublicKey, AccountError.SVMAddressNotFound);

    if (!isJupiterQuote(quote)) {
      throw swapError(
        SwapErrorCode.WrongQuoteProvider,
        new Error('Wrong quote provider'),
      );
    }

    if (!isSolanaProvider(provider)) {
      throw swapError(CommonError.MismatchingProvider);
    }

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

    const [swapTxHash, signError] = await resolve(
      signAndSend(RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION, [
        {
          account: userPublicKey,
          serializedTx: txResponse.swapTransaction,
        },
      ]),
    );

    if (isUserRejectionError(signError)) {
      throw signError;
    } else if (signError || !swapTxHash) {
      throw swapError(CommonError.UnableToSign, signError);
    }

    return swapTxHash;
  },
};
