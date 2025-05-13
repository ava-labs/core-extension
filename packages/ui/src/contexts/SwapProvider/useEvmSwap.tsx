import { ChainId } from '@avalabs/core-chains-sdk';
import { resolve } from '@avalabs/core-utils-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { TransactionParams } from '@avalabs/evm-module';
import { RpcMethod } from '@avalabs/vm-module-types';
import {
  assert,
  assertPresent,
  getProviderForNetwork,
  incrementalPromiseResolve,
  isUserRejectionError,
  wrapError,
  WrappedError,
} from '@core/common';
import {
  CommonError,
  FeatureGates,
  SecretType,
  SwapErrorCode,
} from '@core/types';
import {
  constructBuildTx,
  constructFetchFetcher,
  constructGetBalances,
  constructGetRate,
  constructGetSpender,
  constructPartialSDK,
  OptimalRate,
  SwapSide,
} from '@paraswap/sdk';
import Big from 'big.js';
import { BN } from 'bn.js';
import Joi from 'joi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnectionContext } from '../ConnectionProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import { NATIVE_TOKEN_ADDRESS, WAVAX_ADDRESS, WETH_ADDRESS } from './constants';
import WAVAX_ABI from './ABI_WAVAX.json';
import WETH_ABI from './ABI_WETH.json';
import {
  BuildTxParams,
  GetRateParams,
  GetSwapPropsParams,
  isAPIError,
  isUnwrapOperationParams,
  isWrapOperationParams,
  SwapAdapter,
  SwapParams,
  UnwrapOperation,
  ValidTransactionResponse,
  WrapOperation,
} from './models';
import {
  buildApprovalTx,
  buildUnwrapTx,
  buildWrapTx,
  checkForErrorsInBuildTxResult,
  checkForErrorsInGetRateResult,
  ensureAllowance,
  getPartnerFeeParams,
  hasEnoughAllowance,
  paraswapErrorToSwapError,
  swapError,
  validateParaswapParams,
} from './swap-utils';

export const useEvmSwap: SwapAdapter<
  OptimalRate | WrapOperation | UnwrapOperation,
  | SwapParams<OptimalRate>
  | SwapParams<WrapOperation>
  | SwapParams<UnwrapOperation>
> = (
  { account, network, walletDetails },
  { onTransactionReceipt, showPendingToast },
) => {
  const { request } = useConnectionContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const { t } = useTranslation();

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

  const paraswap = useMemo(() => {
    const chainId = network?.chainId;
    return isParaswapSupportedChain(chainId)
      ? constructPartialSDK(
          {
            chainId: chainId,
            fetcher: constructFetchFetcher(fetch),
          },
          constructGetRate,
          constructGetBalances,
          constructBuildTx,
          constructGetSpender,
        )
      : null;
  }, [network?.chainId]);

  const getRate = useCallback(
    async ({
      srcToken,
      destToken,
      srcDecimals,
      destDecimals,
      srcAmount,
      swapSide,
      fromTokenBalance,
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

      assertPresent(paraswap, SwapErrorCode.ClientNotInitialized);

      const isFromTokenNative = network.networkToken.symbol === srcToken;
      const isDestTokenNative = network.networkToken.symbol === destToken;
      const wrappableTokens = [WAVAX_ADDRESS, WETH_ADDRESS];

      if (
        isFromTokenNative &&
        wrappableTokens.includes(destToken.toLowerCase())
      ) {
        return {
          error: undefined,
          quote: {
            type: 'WRAP' as const,
            target: destToken,
            amount: srcAmount,
          },
          destAmount: srcAmount,
        };
      } else if (
        isDestTokenNative &&
        wrappableTokens.includes(srcToken.toLowerCase())
      ) {
        return {
          error: undefined,
          quote: {
            type: 'UNWRAP' as const,
            source: srcToken,
            amount: srcAmount,
          },
          destAmount: srcAmount,
        };
      }

      const optimalRates = async () => {
        return await paraswap.getRate({
          srcToken: isFromTokenNative ? NATIVE_TOKEN_ADDRESS : srcToken,
          destToken: isDestTokenNative ? NATIVE_TOKEN_ADDRESS : destToken,
          amount: srcAmount,
          side: swapSide || SwapSide.SELL,
          srcDecimals: isFromTokenNative ? 18 : srcDecimals,
          destDecimals: isDestTokenNative ? 18 : destDecimals,
          userAddress: account.addressC,
        });
      };

      try {
        const result = await incrementalPromiseResolve<OptimalRate>(
          () => optimalRates(),
          checkForErrorsInGetRateResult,
        );

        /**
         * This can be an error, the bacground tries 10x but if the
         * server is still "busy" it sends the error
         */
        if (isAPIError(result)) {
          return {
            error: {
              message: t('paraswap error message while get rate: {{message}}', {
                message: result.message,
              }),
            },
            quote: null,
          };
        }

        const resultAmount =
          swapSide === SwapSide.SELL ? result.destAmount : result.srcAmount;

        // Make sure user has enough balance to cover the amount returned by Paraswap
        if (fromTokenBalance) {
          const hasEnough =
            swapSide === SwapSide.BUY
              ? fromTokenBalance >= BigInt(resultAmount ?? '')
              : fromTokenBalance >= BigInt(srcAmount ?? '');

          if (!hasEnough) {
            return {
              quote: null,
              destAmount: resultAmount,
              error: { message: t('Insufficient balance.') },
            };
          }
        }

        return {
          quote: result,
          destAmount: resultAmount,
        };
      } catch (error: any) {
        return {
          quote: null,
          error: paraswapErrorToSwapError(error),
        };
      }
    },
    [account, network, isFlagEnabled, paraswap, t],
  );

  const buildTx = useCallback(
    async ({
      srcToken,
      destToken,
      srcAmount,
      destAmount,
      srcDecimals,
      destDecimals,
      priceRoute,
      userAddress,
      ignoreChecks,
      isNativeTokenSwap,
    }: BuildTxParams) => {
      assertPresent(network, CommonError.NoActiveNetwork);
      assertPresent(paraswap, SwapErrorCode.ClientNotInitialized);

      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      const responseSchema = Joi.object<ValidTransactionResponse>({
        to: Joi.string().required(),
        from: Joi.string().required(),
        value: Joi.string().required(),
        data: Joi.string().required(),
        chainId: Joi.number().required(),
        gas: Joi.string().optional(),
        gasPrice: Joi.string().optional(),
      }).unknown();

      const transactionParamsOrError: TransactionParams | WrappedError =
        await paraswap
          .buildTx(
            {
              srcToken,
              srcDecimals,
              srcAmount,
              destToken,
              destDecimals,
              destAmount,
              priceRoute,
              userAddress,
              partner: 'Avalanche',
              ...getPartnerFeeParams(isFlagEnabled(FeatureGates.SWAP_FEES)),
            },
            {
              ignoreChecks,
            },
          )
          .catch(wrapError(swapError(CommonError.NetworkError)));

      const validationResult = responseSchema.validate(
        transactionParamsOrError,
      );

      if (validationResult.error) {
        if (isAPIError(transactionParamsOrError)) {
          throw swapError(
            SwapErrorCode.ApiError,
            new Error(transactionParamsOrError.message),
          );
        }
        throw swapError(
          SwapErrorCode.UnexpectedApiResponse,
          validationResult.error,
        );
      }

      const txPayload = validationResult.value;

      return {
        chainId: `0x${network.chainId.toString(16)}`,
        gas: txPayload.gas
          ? '0x' + Number(txPayload.gas).toString(16)
          : undefined,
        data: txPayload.data,
        to: txPayload.to,
        from: userAddress,
        value: isNativeTokenSwap
          ? `0x${new BN(srcAmount).toString('hex')}`
          : undefined, // AVAX value needs to be sent with the transaction
      };
    },
    [isFlagEnabled, paraswap, network],
  );

  const getSwapTxProps = useCallback(
    async ({
      srcToken,
      destToken,
      srcAmount,
      slippage,
      nativeToken,
      priceRoute,
    }: GetSwapPropsParams) => {
      assertPresent(paraswap, SwapErrorCode.ClientNotInitialized);
      assertPresent(network, CommonError.NoActiveNetwork);

      const minAmount = new Big(priceRoute.destAmount)
        .times(1 - slippage / 100)
        .toFixed(0);
      const maxAmount = new Big(srcAmount).times(1 + slippage / 100).toFixed(0);
      const sourceAmount =
        priceRoute.side === SwapSide.SELL ? srcAmount : maxAmount;

      const destinationAmount =
        priceRoute.side === SwapSide.SELL ? minAmount : priceRoute.destAmount;

      return {
        srcTokenAddress:
          srcToken === nativeToken ? NATIVE_TOKEN_ADDRESS : srcToken,
        destTokenAddress:
          destToken === nativeToken ? NATIVE_TOKEN_ADDRESS : destToken,
        spender: await paraswap.getSpender(),
        sourceAmount,
        destinationAmount,
      };
    },
    [paraswap, network],
  );

  /**
   * Used to perform a batch swap operation (approval + transfer) in a single click for the user.
   * Some notes:
   *
   *  - Requires a feature flag to be enabled.
   *  - When transferring AVAX, it performs the usual eth_sendTransaction request.
   *  - If the allowance covers the transfer amount, it performs the usual eth_sendTransaction request
   */
  const oneClickSwap = useCallback(
    async (params: SwapParams<OptimalRate>) => {
      if (!isFlagEnabled(FeatureGates.ONE_CLICK_SWAP)) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      assertPresent(network, CommonError.NoActiveNetwork);
      assertPresent(account, CommonError.NoActiveAccount);
      assertPresent(rpcProvider, CommonError.Unknown);
      assert(!network.isTestnet, CommonError.UnknownNetwork);

      const {
        srcToken,
        destToken,
        srcAmount,
        srcDecimals,
        destDecimals,
        destAmount,
        quote,
        slippage,
      } = validateParaswapParams(params);

      const userAddress = account.addressC;
      const {
        srcTokenAddress,
        destTokenAddress,
        destinationAmount,
        sourceAmount,
        spender,
      } = await getSwapTxProps({
        srcToken,
        destToken,
        srcAmount,
        slippage,
        nativeToken: network.networkToken.symbol,
        priceRoute: quote,
      });

      const batch: TransactionParams[] = [];

      const isNativeTokenSwap = srcToken === network.networkToken.symbol;

      // no need to approve AVAX
      if (!isNativeTokenSwap) {
        const allowanceCoversAmount = await hasEnoughAllowance({
          tokenAddress: srcTokenAddress,
          provider: rpcProvider,
          userAddress,
          spenderAddress: spender,
          requiredAmount: BigInt(sourceAmount),
        });

        if (!allowanceCoversAmount) {
          const approvalTx = await buildApprovalTx({
            userAddress,
            spenderAddress: spender,
            tokenAddress: srcTokenAddress,
            amount: BigInt(sourceAmount),
            provider: rpcProvider,
          });

          batch.push(approvalTx);
        }
      }

      const ignoreChecks = batch.length > 0; // Only ignore checks if we have an approval transaction in the batch
      const swapTx = await buildTx({
        network: network.chainId.toString(),
        srcToken: srcTokenAddress,
        destToken: destTokenAddress,
        srcAmount: sourceAmount,
        destAmount: destinationAmount,
        priceRoute: quote,
        userAddress,
        srcDecimals:
          network.networkToken.symbol === srcToken ? 18 : srcDecimals,
        destDecimals:
          network.networkToken.symbol === destToken ? 18 : destDecimals,
        ignoreChecks,
        isNativeTokenSwap,
      });

      batch.push(swapTx);

      let swapTxHash;

      if (batch.length > 1) {
        const [txHashes, batchSignError] = await resolve<string[]>(
          request(
            {
              method: RpcMethod.ETH_SEND_TRANSACTION_BATCH,
              params: batch,
            },
            {
              customApprovalScreenTitle: t('Confirm Swap'),
              customApprovalButtonText: t('Swap'),
            },
          ),
        );

        if (isUserRejectionError(batchSignError)) {
          throw batchSignError;
        } else if (batchSignError || !txHashes) {
          throw swapError(CommonError.UnableToSign, batchSignError);
        }

        swapTxHash = txHashes[txHashes.length - 1];
      } else {
        const [txHash, signError] = await resolve(
          request({
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [batch[0]],
          }),
        );

        if (isUserRejectionError(signError)) {
          throw signError;
        } else if (signError || !txHash) {
          throw swapError(CommonError.UnableToSign, signError);
        }

        swapTxHash = txHash;
      }

      const pendingToastId = showPendingToast();

      rpcProvider.waitForTransaction(swapTxHash).then((receipt) => {
        const isSuccessful = Boolean(receipt && receipt.status === 1);

        onTransactionReceipt({
          isSuccessful,
          pendingToastId,
          txHash: swapTxHash,
          chainId: network.chainId,
          userAddress,
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
      isFlagEnabled,
      network,
      account,
      rpcProvider,
      getSwapTxProps,
      buildTx,
      request,
      t,
      onTransactionReceipt,
      showPendingToast,
    ],
  );

  const performWrapOperation = useCallback(
    async (params: SwapParams<WrapOperation> | SwapParams<UnwrapOperation>) => {
      assertPresent(network, CommonError.NoActiveNetwork);
      assertPresent(account, CommonError.NoActiveAccount);
      assertPresent(rpcProvider, CommonError.Unknown);
      assert(!network.isTestnet, CommonError.UnknownNetwork);

      const { srcToken, destToken, srcDecimals, destDecimals } = params;
      const userAddress = account.addressC;
      const tokenAddress =
        params.quote.type === 'WRAP'
          ? params.quote.target
          : params.quote.source;
      const amount = params.quote.amount;

      const abi = tokenAddress === WETH_ADDRESS ? WETH_ABI : WAVAX_ABI;
      const buildTxParams = {
        userAddress,
        tokenAddress,
        amount,
        provider: rpcProvider,
        abi,
      };
      const tx =
        params.quote.type === 'WRAP'
          ? await buildWrapTx(buildTxParams)
          : await buildUnwrapTx(buildTxParams);

      const [txHash, signError] = await resolve(
        request({
          method: RpcMethod.ETH_SEND_TRANSACTION,
          params: [tx],
        }),
      );

      if (isUserRejectionError(signError)) {
        throw signError;
      } else if (signError || !txHash) {
        throw swapError(CommonError.UnableToSign, signError);
      }

      const pendingToastId = showPendingToast();

      rpcProvider.waitForTransaction(txHash).then((receipt) => {
        const isSuccessful = Boolean(receipt && receipt.status === 1);

        onTransactionReceipt({
          isSuccessful,
          pendingToastId,
          txHash: txHash,
          chainId: network.chainId,
          userAddress,
          srcToken,
          destToken,
          srcAmount: amount,
          destAmount: amount,
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
      showPendingToast,
      onTransactionReceipt,
    ],
  );

  const regularSwap = useCallback(
    async (params: SwapParams<OptimalRate>) => {
      assertPresent(network, CommonError.NoActiveNetwork);
      assertPresent(account, CommonError.NoActiveAccount);
      assertPresent(rpcProvider, CommonError.Unknown);
      assert(!network.isTestnet, CommonError.UnknownNetwork);

      const {
        srcToken,
        destToken,
        srcAmount,
        destAmount,
        srcDecimals,
        destDecimals,
        quote,
        slippage,
      } = validateParaswapParams(params);

      const userAddress = account.addressC;
      const {
        srcTokenAddress,
        destTokenAddress,
        destinationAmount,
        sourceAmount,
        spender,
      } = await getSwapTxProps({
        srcToken,
        destToken,
        srcAmount,
        slippage,
        nativeToken: network.networkToken.symbol,
        priceRoute: quote,
      });

      // no need to approve AVAX
      const isNativeTokenSwap = srcToken === network.networkToken.symbol;

      if (!isNativeTokenSwap) {
        await ensureAllowance({
          amount: BigInt(sourceAmount),
          provider: rpcProvider,
          request,
          spenderAddress: spender,
          tokenAddress: srcTokenAddress,
          userAddress,
        });
      }

      const [swapTx, txBuildDataError] = await resolve(
        incrementalPromiseResolve(
          () =>
            buildTx({
              network: network.chainId.toString(),
              srcToken: srcTokenAddress,
              destToken: destTokenAddress,
              srcAmount: sourceAmount,
              destAmount: destinationAmount,
              priceRoute: quote,
              userAddress,
              isNativeTokenSwap,
              srcDecimals:
                network.networkToken.symbol === srcToken ? 18 : srcDecimals,
              destDecimals:
                network.networkToken.symbol === destToken ? 18 : destDecimals,
            }),
          checkForErrorsInBuildTxResult,
          0,
          10,
        ),
      );
      if (txBuildDataError || !swapTx) {
        throw swapError(SwapErrorCode.CannotBuildTx, txBuildDataError);
      }

      const [swapTxHash, signError] = await resolve(
        request(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [swapTx],
          },
          {
            customApprovalScreenTitle: t('Confirm Swap'),
            customApprovalButtonText: t('Swap'),
          },
        ),
      );

      if (isUserRejectionError(signError)) {
        throw signError;
      } else if (signError || !swapTxHash) {
        throw swapError(CommonError.UnableToSign, signError);
      }

      const pendingToastId = showPendingToast();

      rpcProvider.waitForTransaction(swapTxHash).then((receipt) => {
        const isSuccessful = Boolean(receipt && receipt.status === 1);

        onTransactionReceipt({
          isSuccessful,
          pendingToastId,
          txHash: swapTxHash,
          chainId: network.chainId,
          userAddress,
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
      network,
      account,
      rpcProvider,
      getSwapTxProps,
      request,
      buildTx,
      t,
      onTransactionReceipt,
      showPendingToast,
    ],
  );

  const swap = useCallback(
    async (
      params:
        | SwapParams<OptimalRate>
        | SwapParams<WrapOperation>
        | SwapParams<UnwrapOperation>,
    ) => {
      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw swapError(SwapErrorCode.FeatureDisabled);
      }

      const isOneClickSwapEnabled = isFlagEnabled(FeatureGates.ONE_CLICK_SWAP);
      const isOneClickSwapSupported =
        walletDetails?.type === SecretType.Mnemonic ||
        walletDetails?.type === SecretType.Seedless ||
        walletDetails?.type === SecretType.PrivateKey;

      if (isWrapOperationParams(params) || isUnwrapOperationParams(params)) {
        return performWrapOperation(params);
      }

      if (isOneClickSwapEnabled && isOneClickSwapSupported) {
        return oneClickSwap(params);
      }

      return regularSwap(params);
    },
    [
      regularSwap,
      oneClickSwap,
      isFlagEnabled,
      walletDetails?.type,
      performWrapOperation,
    ],
  );

  return {
    getRate,
    swap,
  };
};

const isParaswapSupportedChain = (
  chainId?: number,
): chainId is ChainId.AVALANCHE_MAINNET_ID | ChainId.ETHEREUM_HOMESTEAD =>
  chainId === ChainId.AVALANCHE_MAINNET_ID ||
  chainId === ChainId.ETHEREUM_HOMESTEAD;
