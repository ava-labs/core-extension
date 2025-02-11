import { createContext, useCallback, useContext, useMemo } from 'react';
import type { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { TransactionParams } from '@avalabs/evm-module';
import { resolve } from '@avalabs/core-utils-sdk';
import { useConnectionContext } from '../ConnectionProvider';
import { SwapSide } from 'paraswap-core';
import browser from 'webextension-polyfill';
import { APIError, ETHER_ADDRESS, ParaSwap, Transaction } from 'paraswap';
import { useNetworkContext } from '../NetworkProvider';
import { useAccountsContext } from '../AccountsProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { ChainId } from '@avalabs/core-chains-sdk';
import Web3 from 'web3';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import Big from 'big.js';
import { RpcMethod, TokenType } from '@avalabs/vm-module-types';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { BN } from 'bn.js';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useNetworkFeeContext } from '../NetworkFeeProvider';
import { useTranslation } from 'react-i18next';
import {
  GetRateParams,
  ParaswapPricesResponse,
  SwapContextAPI,
  SwapParams,
  DISALLOWED_SWAP_ASSETS,
  BuildTxParams,
  GetSwapPropsParams,
  ValidTransactionResponse,
} from './models';
import Joi from 'joi';
import { isAPIError } from '@src/pages/Swap/utils';
import {
  buildApprovalTx,
  checkForErrorsInBuildTxResult,
  checkForErrorsInGetRateResult,
  ensureAllowance,
  hasEnoughAllowance,
  throwError,
  validateParams,
} from './swap-utils';
import { assert, assertPresent } from '@src/utils/assertions';
import { CommonError } from '@src/utils/errors';
import { useWalletContext } from '../WalletProvider';
import { SecretType } from '@src/background/services/secrets/models';
import { toast } from '@avalabs/core-k2-components';

export const SwapContext = createContext<SwapContextAPI>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const { network: activeNetwork, avaxProviderC } = useNetworkContext();
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

  const paraswap = useMemo(
    () => new ParaSwap(ChainId.AVALANCHE_MAINNET_ID, undefined, new Web3()),
    [],
  );

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
        throw new Error(`Unsupported network: ${activeNetwork?.chainId}`);
      }
      if (!activeAccount || !activeAccount.addressC) {
        throw new Error('Account address missing');
      }

      if (!isFlagEnabled(FeatureGates.SWAP)) {
        throw new Error(`Feature (SWAP) is currently unavailable`);
      }

      const query = new URLSearchParams({
        srcToken,
        destToken,
        amount: srcAmount,
        side: swapSide || SwapSide.SELL,
        network: ChainId.AVALANCHE_MAINNET_ID.toString(),
        srcDecimals: `${
          activeNetwork.networkToken.symbol === srcToken ? 18 : srcDecimals
        }`,
        destDecimals: `${
          activeNetwork.networkToken.symbol === destToken ? 18 : destDecimals
        }`,
        userAddress: activeAccount.addressC,
      });

      // apiURL is a private property
      const url = `${(paraswap as any).apiURL}/prices/?${query.toString()}`;

      const optimalRates = async () => {
        const response = await fetch(url);
        return response.json();
      };

      const result = await incrementalPromiseResolve<ParaswapPricesResponse>(
        () => optimalRates(),
        checkForErrorsInGetRateResult,
      );

      return {
        optimalRate: result.priceRoute ?? null,
        destAmount: result.priceRoute?.destAmount,
      };
    },
    [activeAccount, activeNetwork, isFlagEnabled, paraswap],
  );

  const getParaswapSpender = useCallback(async () => {
    if (!isFlagEnabled(FeatureGates.SWAP)) {
      throw new Error(`Feature (SWAP) is currently unavailable`);
    }

    const response = await fetch(
      `${(paraswap as any).apiURL}/adapters/contracts?network=${
        ChainId.AVALANCHE_MAINNET_ID
      }`,
    );

    const result = await response.json();
    return result.TokenTransferProxy;
  }, [paraswap, isFlagEnabled]);

  const buildTx = useCallback(
    async ({
      network,
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

      const txURL = `${(paraswap as any).apiURL}/transactions/${network}`;
      const txConfig = {
        srcToken,
        srcDecimals,
        srcAmount,
        destToken,
        destDecimals,
        destAmount,
        priceRoute,
        userAddress,
        partner: 'Avalanche',
        ignoreChecks,
      };

      const response = await fetch(txURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(txConfig),
      });
      const transactionParamsOrError: Transaction | APIError =
        await response.json();
      const validationResult = responseSchema.validate(
        transactionParamsOrError,
      );

      if (!response.ok || validationResult.error) {
        if (isAPIError(transactionParamsOrError)) {
          throw new Error(transactionParamsOrError.message);
        }
        throw new Error('Invalid transaction params');
      }

      const txPayload = validationResult.value;

      return {
        chainId: `0x${ChainId.AVALANCHE_MAINNET_ID.toString(16)}`,
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
    [isFlagEnabled, paraswap],
  );

  const notifyOnSwapResult = useCallback(
    async ({
      provider,
      txHash,
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
      userAddress: string;
      srcToken: string;
      destToken: string;
      srcAmount: string;
      destAmount: string;
      srcDecimals: number;
      destDecimals: number;
    }) => {
      provider.waitForTransaction(txHash).then(async (tx) => {
        const isSuccessful = tx && tx.status === 1;

        captureEncrypted(isSuccessful ? 'SwapSuccessful' : 'SwapFailed', {
          address: userAddress,
          txHash: txHash,
          chainId: ChainId.AVALANCHE_MAINNET_ID,
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

        toast.success(notificationText);

        browser.notifications.create({
          type: 'basic',
          title: notificationText,
          iconUrl: '../../../../images/icon-256.png',
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
    [captureEncrypted, findSymbol, t],
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
      const minAmount = new Big(priceRoute.destAmount)
        .times(1 - slippage / 100)
        .toFixed(0);
      const maxAmount = new Big(srcAmount).times(1 + slippage / 100).toFixed(0);
      const sourceAmount = priceRoute.side === 'SELL' ? srcAmount : maxAmount;

      const destinationAmount =
        priceRoute.side === 'SELL' ? minAmount : priceRoute.destAmount;

      return {
        srcTokenAddress: srcToken === nativeToken ? ETHER_ADDRESS : srcToken,
        destTokenAddress: destToken === nativeToken ? ETHER_ADDRESS : destToken,
        spender: await getParaswapSpender(),
        sourceAmount,
        destinationAmount,
      };
    },
    [getParaswapSpender],
  );

  /**
   * Used to perform a batch swap operation (approval + transfer) in a single click for the user.
   * Some notes:
   *
   *  - Requires a feature flag to be enabled.
   *  - When transfering AVAX, it performs the usual eth_sendTransaction request.
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
      assertPresent(avaxProviderC, CommonError.Unknown);
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
          provider: avaxProviderC,
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
            provider: avaxProviderC,
          });

          batch.push(approvalTx);
        }
      }

      const ignoreChecks = batch.length > 0; // Only ignore checks if we have an approval transaction in the batch
      const swapTx = await buildTx({
        network: ChainId.AVALANCHE_MAINNET_ID.toString(),
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
          request({
            method: RpcMethod.ETH_SEND_TRANSACTION_BATCH,
            params: batch,
          }),
        );

        if (batchSignError || !txHashes) {
          return throwError(batchSignError);
        }

        swapTxHash = txHashes[txHashes.length - 1];
      } else {
        const [txHash, signError] = await resolve(
          request({
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [batch[0]],
          }),
        );

        if (signError || !txHash) {
          return throwError(signError);
        }

        swapTxHash = txHash;
      }

      notifyOnSwapResult({
        provider: avaxProviderC,
        txHash: swapTxHash,
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
      activeAccount,
      activeNetwork,
      avaxProviderC,
      buildTx,
      networkFee,
      request,
      notifyOnSwapResult,
      getSwapTxProps,
      isFlagEnabled,
    ],
  );

  const regularSwap = useCallback(
    async (params: SwapParams) => {
      assertPresent(activeNetwork, CommonError.NoActiveNetwork);
      assertPresent(networkFee, CommonError.UnknownNetworkFee);
      assertPresent(activeAccount, CommonError.NoActiveAccount);
      assertPresent(avaxProviderC, CommonError.Unknown);
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
          provider: avaxProviderC,
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
              network: ChainId.AVALANCHE_MAINNET_ID.toString(),
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
        throw new Error(`Data Error: ${txBuildDataError}`);
      }

      const [swapTxHash, signError] = await resolve(
        request({
          method: RpcMethod.ETH_SEND_TRANSACTION,
          params: [swapTx],
        }),
      );

      if (signError || !swapTxHash) {
        return throwError(signError);
      }

      notifyOnSwapResult({
        provider: avaxProviderC,
        txHash: swapTxHash,
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
      activeAccount,
      activeNetwork,
      avaxProviderC,
      buildTx,
      networkFee,
      request,
      notifyOnSwapResult,
      getSwapTxProps,
    ],
  );

  const swap = useCallback(
    async (params: SwapParams) => {
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

export function useSwapContext() {
  return useContext(SwapContext);
}
