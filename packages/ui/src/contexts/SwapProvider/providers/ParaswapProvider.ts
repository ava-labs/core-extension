import {
  GetQuoteParams,
  isEvmProvider,
  NormalizedSwapQuote,
  NormalizedSwapQuoteResult,
  PerformSwapParams,
  SwapProvider,
  SwapProviders,
} from '../types';
import ParaswapService from '../services/ParaswapService';
import { TransactionParams as Transaction } from '@paraswap/sdk';
import { isParaswapQuote, SwapWalletState } from '../models';
import { getPartnerFeeParams, swapError } from '../swap-utils';
import { CommonError, SwapErrorCode } from '@core/types';
import { NATIVE_TOKEN_ADDRESS, PARASWAP_PARTNER_FEE_BPS } from '../constants';
import Big from 'big.js';
import { ensureAllowance } from '../utils/ensureAllowance';
import { promiseResolveWithBackoff, resolve } from '@avalabs/core-utils-sdk';
import { TransactionParams } from '@avalabs/evm-module';
import { bigIntToHex } from '@ethereumjs/util';
import { isUserRejectionError } from '@core/common';
import { RpcMethod } from '@avalabs/vm-module-types';

const PARTNER = 'Avalanche';

export const ParaswapProvider: SwapProvider = {
  name: SwapProviders.PARASWAP,

  async getQuote(
    {
      fromTokenAddress,
      fromTokenDecimals,
      toTokenAddress,
      toTokenDecimals,
      amount,
      destination,
      network,
      account,
    }: GetQuoteParams & SwapWalletState,
    abortSignal?: AbortSignal,
  ): Promise<NormalizedSwapQuoteResult> {
    if (!network || network.isTestnet) {
      throw swapError(CommonError.UnknownNetwork);
    }

    if (!account || !account.addressC) {
      throw swapError(CommonError.NoActiveAccount);
    }

    if (!fromTokenAddress || !fromTokenDecimals) {
      throw new Error('No source token selected');
    }

    if (!toTokenAddress || !toTokenDecimals) {
      throw new Error('No destination token selected');
    }

    if (!amount) {
      throw new Error('No amount');
    }

    if (!abortSignal) {
      throw new Error('abortSignal is required when swap provider is enabled');
    }

    const rate = await ParaswapService.getSwapRate({
      srcToken: fromTokenAddress,
      srcDecimals: fromTokenDecimals,
      destToken: toTokenAddress,
      destDecimals: toTokenDecimals,
      srcAmount: amount,
      swapSide: destination,
      network: network,
      account: account,
      abortSignal,
    });

    const quote: NormalizedSwapQuote = {
      quote: rate,
      metadata: {
        amountIn: rate.srcAmount,
        amountOut: rate.destAmount,
      },
    };

    return {
      provider: this.name,
      quotes: [quote],
      selected: quote,
    };
  },

  async swap({
    srcTokenAddress,
    isSrcTokenNative,
    destTokenAddress,
    isDestTokenNative,
    quote,
    slippage,
    network,
    provider,
    userAddress,
    signAndSend,
    isSwapFeesEnabled,
    isOneClickSwapEnabled,
    isGaslessOn,
  }: PerformSwapParams & SwapWalletState) {
    if (!srcTokenAddress)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: srcTokenAddress'),
      );
    if (!destTokenAddress)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: destTokenAddress'),
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
    if (!userAddress)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: userAddress'),
      );
    if (!network)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: network'),
      );

    if (network?.isTestnet)
      throw swapError(
        CommonError.UnknownNetwork,
        new Error('Network is not supported'),
      );

    if (!isParaswapQuote(quote)) {
      throw swapError(
        SwapErrorCode.WrongQuoteProvider,
        new Error('Wrong quote provider'),
      );
    }

    if (!isEvmProvider(provider)) {
      throw swapError(CommonError.MismatchingProvider);
    }

    const batch: TransactionParams[] = [];

    const sourceTokenAddress = isSrcTokenNative
      ? NATIVE_TOKEN_ADDRESS
      : srcTokenAddress;
    const destinationTokenAddress = isDestTokenNative
      ? NATIVE_TOKEN_ADDRESS
      : destTokenAddress;

    const slippagePercent = slippage / 100;
    const feePercent = isSwapFeesEnabled
      ? PARASWAP_PARTNER_FEE_BPS / 10_000
      : 0;
    const totalPercent = slippagePercent + feePercent;

    const minAmount = new Big(quote.destAmount)
      .times(1 - totalPercent)
      .toFixed(0);

    const maxAmount = new Big(quote.srcAmount)
      .times(1 + totalPercent)
      .toFixed(0);

    const sourceAmount = quote.side === 'SELL' ? quote.srcAmount : maxAmount;

    const destinationAmount =
      quote.side === 'SELL' ? minAmount : quote.destAmount;

    // no need to approve native token
    if (!isSrcTokenNative) {
      let spenderAddress: string;

      try {
        spenderAddress = await ParaswapService.getParaswapSpender(network);
      } catch (error) {
        throw swapError(SwapErrorCode.CannotFetchSpender, error);
      }

      const approvalTxHash = await ensureAllowance({
        amount: BigInt(sourceAmount),
        provider,
        signAndSend,
        spenderAddress,
        tokenAddress: srcTokenAddress,
        userAddress,
        isOneClickSwapEnabled,
        batch,
        isGaslessOn,
      });

      if (approvalTxHash && !isOneClickSwapEnabled) {
        const receipt = await provider.waitForTransaction(approvalTxHash);

        if (!receipt || (receipt && receipt.status !== 1)) {
          throw swapError(
            SwapErrorCode.ApprovalTxFailed,
            new Error('Transaction Reverted'),
          );
        }
      }
    }

    function checkForErrorsInResult(result: Transaction | Error): boolean {
      return (
        (result as Error).message === 'Server too busy' ||
        // paraswap returns responses like this: {error: 'Not enough 0x4f60a160d8c2dddaafe16fcc57566db84d674…}
        // when they are too slow to detect the approval

        (result as any).error ||
        result instanceof Error
      );
    }

    const [txBuildData, txBuildDataError] = await resolve(
      promiseResolveWithBackoff(
        () =>
          ParaswapService.buildTx({
            network,
            srcToken: sourceTokenAddress,
            destToken: destinationTokenAddress,
            srcAmount: sourceAmount,
            destAmount: destinationAmount,
            priceRoute: quote,
            userAddress,
            partner: PARTNER,
            srcDecimals: quote.srcDecimals,
            destDecimals: quote.destDecimals,
            ...getPartnerFeeParams(isSwapFeesEnabled),
            ignoreChecks: batch.length > 0,
          }),
        checkForErrorsInResult,
        0,
        10,
      ),
    );

    if (!txBuildData || txBuildDataError) {
      throw swapError(SwapErrorCode.CannotBuildTx, txBuildDataError);
    }

    const txParams: [TransactionParams] = [
      {
        from: userAddress,
        to: txBuildData.to,
        gas:
          txBuildData.gas !== undefined
            ? bigIntToHex(BigInt(txBuildData.gas))
            : undefined,
        data: txBuildData.data,
        value: isSrcTokenNative ? bigIntToHex(BigInt(sourceAmount)) : undefined, // AVAX value needs to be sent with the transaction
      },
    ];

    if (batch.length > 0) {
      batch.push(txParams[0]);
    }
    const method =
      batch.length > 0
        ? RpcMethod.ETH_SEND_TRANSACTION_BATCH
        : RpcMethod.ETH_SEND_TRANSACTION;

    const [swapTxHash, signError] = await resolve(
      signAndSend(method, txParams),
    );

    if (isUserRejectionError(signError)) {
      throw signError;
    } else if (signError || !swapTxHash) {
      throw swapError(CommonError.UnableToSign, signError);
    }

    if (batch.length > 0 && Array.isArray(swapTxHash)) {
      if (swapTxHash.length !== batch.length) {
        throw swapError(
          SwapErrorCode.TransactionError,
          new Error('Transaction hash length mismatch'),
        );
      }
      return swapTxHash[swapTxHash.length - 1];
    }

    return swapTxHash;
  },
};
