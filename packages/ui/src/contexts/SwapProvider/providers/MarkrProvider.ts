import { CommonError, SwapErrorCode } from '@core/types';
import {
  MARKR_EVM_NATIVE_TOKEN_ADDRESS,
  MARKR_EVM_PARTNER_ID,
} from '../constants';
import {
  isMarkrQuote,
  MarkrQuote,
  MarkrTransaction,
  SwapWalletState,
} from '../models';
import MarkrService from '../services/MarkrService';
import { swapError } from '../swap-utils';
import {
  GetQuoteParams,
  isEvmProvider,
  NormalizedSwapQuote,
  NormalizedSwapQuoteResult,
  PerformSwapParams,
  SwapProvider,
  SwapProviders,
} from '../types';
import { resolve } from '@avalabs/core-utils-sdk';
import { ensureAllowance } from '../utils/ensureAllowance';
import Big from 'big.js';
import { TransactionParams } from '@avalabs/evm-module';
import { RpcMethod } from '@avalabs/vm-module-types';
import { isUserRejectionError } from '@core/common';
import { bigIntToHex } from '@ethereumjs/util';

const getNormalizedQuoteResult = (
  rates: MarkrQuote[],
): NormalizedSwapQuoteResult => {
  const quotes: NormalizedSwapQuote[] = [];
  for (const rate of rates) {
    quotes.push({
      quote: rate,
      metadata: {
        amountOut: rate.amountOut,
      },
    });
  }

  return {
    provider: SwapProviders.MARKR,
    quotes: quotes,
    selected: quotes[0]!,
  };
};

export const MarkrProvider: SwapProvider = {
  name: SwapProviders.MARKR,

  async getQuote(
    {
      fromTokenAddress,
      fromTokenDecimals,
      toTokenAddress,
      toTokenDecimals,
      amount,
      network,
      account,
      slippage,
      onUpdate,
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

    if (!onUpdate) {
      throw new Error('onUpdate is required when swap use markr is enabled');
    }

    const onUpdateOverridden = (rates: MarkrQuote[] | undefined) => {
      if (!rates) {
        return;
      }
      onUpdate(getNormalizedQuoteResult(rates));
    };

    const isFromTokenNative = network.networkToken.symbol === fromTokenAddress;
    const isToTokenNative = network.networkToken.symbol === toTokenAddress;

    const rates = await MarkrService.getSwapRateStream({
      fromTokenAddress: isFromTokenNative
        ? MARKR_EVM_NATIVE_TOKEN_ADDRESS
        : fromTokenAddress,
      toTokenAddress: isToTokenNative
        ? MARKR_EVM_NATIVE_TOKEN_ADDRESS
        : toTokenAddress,
      fromTokenDecimals,
      toTokenDecimals,
      amount: amount,
      network,
      account,
      slippage,
      onUpdate: onUpdateOverridden,
      abortSignal,
    });

    if (!rates || rates.length === 0) {
      throw new Error('No rate found');
    }

    return getNormalizedQuoteResult(rates);
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
    isOneClickSwapEnabled,
    markrSwapGasBuffer,
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

    if (!markrSwapGasBuffer)
      throw swapError(
        SwapErrorCode.MissingParams,
        new Error('Missing parameter: markrSwapGasBuffer'),
      );

    if (!isMarkrQuote(quote)) {
      throw swapError(
        SwapErrorCode.WrongQuoteProvider,
        new Error('Wrong quote provider: markr'),
      );
    }

    if (!isEvmProvider(provider)) {
      throw swapError(CommonError.MismatchingProvider);
    }

    const batch: TransactionParams[] = [];

    const { amountIn, amountOut } = quote;

    const slippagePercent = slippage / 100;
    // const feePercent = isSwapFeesEnabled ? MARKR_PARTNER_FEE_BPS / 10_000 : 0
    const totalPercent = slippagePercent;

    const minAmount = new Big(amountOut).times(1 - totalPercent).toFixed(0);

    const sourceAmount = amountIn;
    const destinationAmount = minAmount;

    // no need to approve native token
    if (!isSrcTokenNative) {
      const spenderAddress: string = await MarkrService.getSpenderAddress({
        chainId: network.chainId,
      });

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

    const tx: MarkrTransaction = await MarkrService.buildSwapTransaction({
      quote,
      tokenIn: isSrcTokenNative
        ? MARKR_EVM_NATIVE_TOKEN_ADDRESS
        : srcTokenAddress,
      tokenOut: isDestTokenNative
        ? MARKR_EVM_NATIVE_TOKEN_ADDRESS
        : destTokenAddress,
      amountIn: sourceAmount,
      minAmountOut: destinationAmount,
      appId: MARKR_EVM_PARTNER_ID,
      network,
      from: userAddress,
    });

    const props = {
      from: userAddress,
      to: tx.to,
      gas: undefined,
      data: tx.data,
      value: isSrcTokenNative ? bigIntToHex(BigInt(sourceAmount)) : undefined,
    };

    let swapGasLimit: bigint | null = null;
    let swapGasLimitError: unknown = null;

    if (isGaslessOn) {
      // When gasless is enabled, use state override to simulate the user having enough balance
      // This prevents "insufficient funds for gas" errors during estimation
      const stateOverride = {
        [userAddress]: {
          balance: bigIntToHex(10n ** 18n), // 1 AVAX for simulation
        },
      };

      [swapGasLimit, swapGasLimitError] = await resolve(
        provider
          .send('eth_estimateGas', [
            {
              from: userAddress,
              to: tx.to,
              data: tx.data,
              value: props.value,
            },
            'latest',
            stateOverride,
          ])
          .then((result: string) => BigInt(result)),
      );
    } else {
      [swapGasLimit, swapGasLimitError] = await resolve(
        provider.estimateGas(props),
      );
    }

    if (swapGasLimitError || !swapGasLimit) {
      throw swapError(CommonError.UnableToEstimateGas, swapGasLimitError);
    }

    const gas = bigIntToHex((swapGasLimit * BigInt(markrSwapGasBuffer)) / 100n);

    const txParams: [TransactionParams] = [
      {
        ...props,
        gas: gas,
      },
    ];

    if (batch.length > 0) {
      batch.push(txParams[0]);
    }
    const method =
      batch.length > 1
        ? RpcMethod.ETH_SEND_TRANSACTION_BATCH
        : RpcMethod.ETH_SEND_TRANSACTION;

    const [swapTxHash, signError] = await resolve(
      signAndSend(method, txParams, {
        revertReason: SwapErrorCode.TransactionRevertedDueToSlippage,
      }),
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
