import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { TransactionParams } from '@avalabs/evm-module';
import { resolve } from '@avalabs/core-utils-sdk';
import { useConnectionContext } from '../ConnectionProvider';
import browser from 'webextension-polyfill';
import { useNetworkContext } from '../NetworkProvider';
import { useAccountsContext } from '../AccountsProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import {
  FeatureGates,
  SwapErrorCode,
  NetworkWithCaipId,
  CommonError,
  SecretType,
} from '@core/types';
import { ChainId } from '@avalabs/core-chains-sdk';
import Big from 'big.js';
import { RpcMethod, TokenType } from '@avalabs/vm-module-types';
import { useTokensWithBalances } from '@/hooks/useTokensWithBalances';
import { BN } from 'bn.js';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';
import { useTranslation } from 'react-i18next';
import {
  GetRateParams,
  SwapContextAPI,
  SwapParams,
  DISALLOWED_SWAP_ASSETS,
  BuildTxParams,
  GetSwapPropsParams,
  ValidTransactionResponse,
} from './models';
import Joi from 'joi';
import { isAPIError } from '@/pages/Swap/utils';
import {
  buildApprovalTx,
  checkForErrorsInBuildTxResult,
  checkForErrorsInGetRateResult,
  ensureAllowance,
  getPartnerFeeParams,
  hasEnoughAllowance,
  swapError,
  validateParams,
} from './swap-utils';
import {
  assert,
  assertPresent,
  isUserRejectionError,
  wrapError,
  WrappedError,
  incrementalPromiseResolve,
  getProviderForNetwork,
  getExplorerAddressByNetwork,
  toastCardWithLink,
} from '@core/common';
import { useWalletContext } from '../WalletProvider';
import { toast } from '@avalabs/core-k2-components';
import { SwapPendingToast } from '@/pages/Swap/components/SwapPendingToast';
import {
  constructPartialSDK,
  constructFetchFetcher,
  constructGetRate,
  constructGetBalances,
  constructBuildTx,
  OptimalRate,
  SwapSide,
  constructGetSpender,
} from '@paraswap/sdk';
import { NATIVE_TOKEN_ADDRESS } from './constants';

export const SwapContext = createContext<SwapContextAPI>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const { network: activeNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { walletDetails } = useWalletContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const { networkFee } = useNetworkFeeContext();
  const { captureEncrypted } = useAnalyticsContext();
  const { t } = useTranslation();
  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
  });

  const [rpcProvider, setRpcProvider] = useState<JsonRpcBatchInternal>();

  useEffect(() => {
    let isMounted = true;

    if (activeNetwork) {
      getProviderForNetwork(activeNetwork)
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
  }, [activeNetwork]);

  const paraswap = useMemo(() => {
    const chainId = activeNetwork?.chainId;
    return isSwapCapableChain(chainId)
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
  }, [activeNetwork?.chainId]);

  const findSymbol = useCallback(
    (symbolOrAddress: string) => {
      const tokenInfo = tokens.find((token) =>
        token.type === TokenType.NATIVE
          ? token.symbol === symbolOrAddress
          : token.address === symbolOrAddress,
      );

      return tokenInfo?.symbol ?? symbolOrAddress;
    },
    [tokens],
  );

  const getRate = useCallback(
    async ({
      srcToken,
      destToken,
      srcDecimals,
      destDecimals,
      srcAmount,
      swapSide,
    }: GetRateParams) => {
      if (!activeNetwork || activeNetwork.isTestnet) {
        throw swapError(CommonError.UnknownNetwork);
      }
      if (!activeAccount || !activeAccount.addressC) {
        throw swapError(CommonError.NoActiveAccount);
      }

      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw new Error(`Feature (SWAP) is currently unavailable`);
      }

      assertPresent(paraswap, SwapErrorCode.ClientNotInitialized);

      const isFromTokenNative = activeNetwork.networkToken.symbol === srcToken;
      const isDestTokenNative = activeNetwork.networkToken.symbol === destToken;

      const optimalRates = async () => {
        return await paraswap.getRate({
          srcToken: isFromTokenNative ? NATIVE_TOKEN_ADDRESS : srcToken,
          destToken: isDestTokenNative ? NATIVE_TOKEN_ADDRESS : destToken,
          amount: srcAmount,
          side: swapSide || SwapSide.SELL,
          srcDecimals: isFromTokenNative ? 18 : srcDecimals,
          destDecimals: isDestTokenNative ? 18 : destDecimals,
          userAddress: activeAccount.addressC,
        });
      };

      const result = await incrementalPromiseResolve<OptimalRate>(
        () => optimalRates(),
        checkForErrorsInGetRateResult,
      );

      return {
        optimalRate: result ?? null,
        destAmount: result?.destAmount,
      };
    },
    [activeAccount, activeNetwork, isFlagEnabled, paraswap],
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
      assertPresent(activeNetwork, CommonError.NoActiveNetwork);
      assertPresent(paraswap, SwapErrorCode.ClientNotInitialized);

      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw new Error(`Feature (SWAP) is currently unavailable`);
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
        chainId: `0x${activeNetwork.chainId.toString(16)}`,
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
    [isFlagEnabled, paraswap, activeNetwork],
  );

  const notifyOnSwapResult = useCallback(
    async ({
      provider,
      txHash,
      chainId,
      userAddress,
      srcToken,
      destToken,
      srcAmount,
      destAmount,
      srcDecimals,
      destDecimals,
    }: {
      provider: JsonRpcBatchInternal;
      txHash: string;
      chainId: number;
      userAddress: string;
      srcToken: string;
      destToken: string;
      srcAmount: string;
      destAmount: string;
      srcDecimals: number;
      destDecimals: number;
    }) => {
      const toastId = toast.custom(
        <SwapPendingToast onDismiss={() => toast.remove(toastId)}>
          {t('Swap pending...')}
        </SwapPendingToast>,
        {
          duration: Infinity,
        },
      );

      provider.waitForTransaction(txHash).then(async (tx) => {
        const isSuccessful = tx && tx.status === 1;

        captureEncrypted(isSuccessful ? 'SwapSuccessful' : 'SwapFailed', {
          address: userAddress,
          txHash: txHash,
          chainId,
        });

        const srcAsset = findSymbol(srcToken);
        const destAsset = findSymbol(destToken);
        const srcAssetAmount = new Big(srcAmount)
          .div(10 ** srcDecimals)
          .toString();
        const destAssetAmount = new Big(destAmount)
          .div(10 ** destDecimals)
          .toString();

        const notificationText = isSuccessful
          ? t('Swap transaction succeeded! 🎉')
          : t('Swap transaction failed! ❌');

        toast.remove(toastId);

        if (isSuccessful) {
          toastCardWithLink({
            title: notificationText,
            url: getExplorerAddressByNetwork(
              activeNetwork as NetworkWithCaipId,
              txHash,
            ),
            label: t('View in Explorer'),
          });
        } else {
          toast.error(notificationText, { duration: 5000 });
        }

        browser.notifications.create({
          type: 'basic',
          title: notificationText,
          iconUrl: '../../../../images/icon-192.png',
          priority: 2,
          message: isSuccessful
            ? t(
                'Successfully swapped {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
                {
                  srcAmount: srcAssetAmount,
                  destAmount: destAssetAmount,
                  srcToken: srcAsset,
                  destToken: destAsset,
                },
              )
            : t(
                'Could not swap {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
                {
                  srcToken: srcAsset,
                  destToken: destAsset,
                  srcAmount: srcAssetAmount,
                  destAmount: destAssetAmount,
                },
              ),
        });
      });
    },
    [activeNetwork, captureEncrypted, findSymbol, t],
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
      assertPresent(activeNetwork, CommonError.NoActiveNetwork);

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
    [paraswap, activeNetwork],
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
    async (params: SwapParams) => {
      if (!isFlagEnabled(FeatureGates.ONE_CLICK_SWAP)) {
        throw new Error(`Feature (SWAP) is currently unavailable`);
      }

      assertPresent(activeNetwork, CommonError.NoActiveNetwork);
      assertPresent(networkFee, CommonError.UnknownNetworkFee);
      assertPresent(activeAccount, CommonError.NoActiveAccount);
      assertPresent(rpcProvider, CommonError.Unknown);
      assert(!activeNetwork.isTestnet, CommonError.UnknownNetwork);

      const {
        srcToken,
        destToken,
        srcAmount,
        srcDecimals,
        destDecimals,
        destAmount,
        priceRoute,
        slippage,
      } = validateParams(params);

      const userAddress = activeAccount.addressC;
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
        nativeToken: activeNetwork.networkToken.symbol,
        priceRoute,
      });

      const batch: TransactionParams[] = [];

      const isNativeTokenSwap = srcToken === activeNetwork.networkToken.symbol;

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
        network: activeNetwork.chainId.toString(),
        srcToken: srcTokenAddress,
        destToken: destTokenAddress,
        srcAmount: sourceAmount,
        destAmount: destinationAmount,
        priceRoute,
        userAddress,
        srcDecimals:
          activeNetwork.networkToken.symbol === srcToken ? 18 : srcDecimals,
        destDecimals:
          activeNetwork.networkToken.symbol === destToken ? 18 : destDecimals,
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

      notifyOnSwapResult({
        provider: rpcProvider,
        txHash: swapTxHash,
        chainId: activeNetwork.chainId,
        userAddress,
        srcToken,
        destToken,
        srcAmount,
        destAmount,
        srcDecimals,
        destDecimals,
      });
    },
    [
      isFlagEnabled,
      activeNetwork,
      networkFee,
      activeAccount,
      rpcProvider,
      getSwapTxProps,
      buildTx,
      notifyOnSwapResult,
      request,
      t,
    ],
  );

  const regularSwap = useCallback(
    async (params: SwapParams) => {
      assertPresent(activeNetwork, CommonError.NoActiveNetwork);
      assertPresent(networkFee, CommonError.UnknownNetworkFee);
      assertPresent(activeAccount, CommonError.NoActiveAccount);
      assertPresent(rpcProvider, CommonError.Unknown);
      assert(!activeNetwork.isTestnet, CommonError.UnknownNetwork);

      const {
        srcToken,
        destToken,
        srcAmount,
        srcDecimals,
        destDecimals,
        destAmount,
        priceRoute,
        slippage,
      } = validateParams(params);

      const userAddress = activeAccount.addressC;
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
        nativeToken: activeNetwork.networkToken.symbol,
        priceRoute,
      });

      // no need to approve AVAX
      const isNativeTokenSwap = srcToken === activeNetwork.networkToken.symbol;

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
              network: activeNetwork.chainId.toString(),
              srcToken: srcTokenAddress,
              destToken: destTokenAddress,
              srcAmount: sourceAmount,
              destAmount: destinationAmount,
              priceRoute,
              userAddress,
              isNativeTokenSwap,
              srcDecimals:
                activeNetwork.networkToken.symbol === srcToken
                  ? 18
                  : srcDecimals,
              destDecimals:
                activeNetwork.networkToken.symbol === destToken
                  ? 18
                  : destDecimals,
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

      notifyOnSwapResult({
        provider: rpcProvider,
        txHash: swapTxHash,
        chainId: activeNetwork.chainId,
        userAddress,
        srcToken,
        destToken,
        srcAmount,
        destAmount,
        srcDecimals,
        destDecimals,
      });
    },
    [
      activeNetwork,
      networkFee,
      activeAccount,
      rpcProvider,
      getSwapTxProps,
      request,
      notifyOnSwapResult,
      buildTx,
      t,
    ],
  );

  const swap = useCallback(
    async (params: SwapParams) => {
      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw new Error(`Feature (SWAP) is currently unavailable`);
      }

      const isOneClickSwapEnabled = isFlagEnabled(FeatureGates.ONE_CLICK_SWAP);
      const isOneClickSwapSupported =
        walletDetails?.type === SecretType.Mnemonic ||
        walletDetails?.type === SecretType.Seedless ||
        walletDetails?.type === SecretType.PrivateKey;

      if (isOneClickSwapEnabled && isOneClickSwapSupported) {
        return oneClickSwap(params);
      }

      return regularSwap(params);
    },
    [regularSwap, oneClickSwap, isFlagEnabled, walletDetails?.type],
  );

  return (
    <SwapContext.Provider
      value={{
        getRate,
        swap,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

const isSwapCapableChain = (
  chainId?: number,
): chainId is ChainId.AVALANCHE_MAINNET_ID | ChainId.ETHEREUM_HOMESTEAD =>
  chainId === ChainId.AVALANCHE_MAINNET_ID ||
  chainId === ChainId.ETHEREUM_HOMESTEAD;

export function useSwapContext() {
  return useContext(SwapContext);
}
