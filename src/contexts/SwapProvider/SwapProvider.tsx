import { createContext, useCallback, useContext, useMemo } from 'react';
import { useConnectionContext } from '../ConnectionProvider';
import { OptimalRate, SwapSide } from 'paraswap-core';
import browser from 'webextension-polyfill';
import {
  APIError,
  Address,
  BuildOptions,
  ETHER_ADDRESS,
  ParaSwap,
  PriceString,
  Transaction,
} from 'paraswap';
import { useNetworkContext } from '../NetworkProvider';
import { useAccountsContext } from '../AccountsProvider';
import { useFeatureFlagContext } from '../FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { ChainId } from '@avalabs/chains-sdk';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import Web3 from 'web3';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { useNetworkFeeContext } from '../NetworkFeeProvider';
import Big from 'big.js';
import { resolve } from '@src/utils/promiseResolver';
import { ethers } from 'ethers';
import { EthSendTransactionHandler } from '@src/background/services/wallet/handlers/eth_sendTransaction';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenType } from '@src/background/services/balances/models';
import { BN } from 'bn.js';
import { useAnalyticsContext } from '../AnalyticsProvider';
import { useTranslation } from 'react-i18next';
import {
  GetRateParams,
  PARASWAP_RETRYABLE_ERRORS,
  ParaswapPricesResponse,
  SwapContextAPI,
  SwapParams,
  hasParaswapError,
} from './models';

export const SwapContext = createContext<SwapContextAPI>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const { network: activeNetwork, avalancheProvider } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { featureFlags } = useFeatureFlagContext();
  const { networkFee } = useNetworkFeeContext();
  const { captureEncrypted } = useAnalyticsContext();
  const { t } = useTranslation();
  const tokens = useTokensWithBalances(true);

  const paraswap = useMemo(
    () => new ParaSwap(ChainId.AVALANCHE_MAINNET_ID, undefined, new Web3()),
    []
  );

  const findSymbol = useCallback(
    (symbolOrAddress: string) => {
      const tokenInfo = tokens.find((token) =>
        token.type === TokenType.NATIVE
          ? token.symbol === symbolOrAddress
          : token.address === symbolOrAddress
      );

      return tokenInfo?.symbol ?? symbolOrAddress;
    },
    [tokens]
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

      if (!featureFlags[FeatureGates.SWAP]) {
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

      function checkForErrorsInResult(
        response: ParaswapPricesResponse | TypeError
      ) {
        const isFetchError = response instanceof TypeError;
        const isParaswapError = !isFetchError && hasParaswapError(response);

        if (isFetchError || isParaswapError) {
          // If there is an error, we may want to retry the request if a network issue
          // or some of the documented Paraswap API errors occurred.
          const isNetworkIssue =
            isFetchError && response.message === 'Failed to fetch';
          const shouldBeRetried =
            isNetworkIssue ||
            (isParaswapError &&
              PARASWAP_RETRYABLE_ERRORS.includes(response.error));

          if (shouldBeRetried) {
            return true;
            // If an error occurred, but there is no point in retrying a request,
            // we need to propagate the error so we're able to show an approriate
            // message in the UI.
          } else if (isFetchError) {
            throw response;
          } else {
            throw new Error(response.error);
          }
        }

        return false;
      }

      const result = await incrementalPromiseResolve<ParaswapPricesResponse>(
        () => optimalRates(),
        checkForErrorsInResult
      );

      return {
        optimalRate: result.priceRoute ?? null,
        destAmount: result.priceRoute?.destAmount,
      };
    },
    [activeAccount, activeNetwork, featureFlags, paraswap]
  );

  const getParaswapSpender = useCallback(async () => {
    if (!featureFlags[FeatureGates.SWAP]) {
      throw new Error(`Feature (SWAP) is currently unavailable`);
    }

    const response = await fetch(
      `${(paraswap as any).apiURL}/adapters/contracts?network=${
        ChainId.AVALANCHE_MAINNET_ID
      }`
    );

    const result = await response.json();
    return result.TokenTransferProxy;
  }, [paraswap, featureFlags]);

  const buildTx = useCallback(
    async (
      network: string,
      srcToken: Address,
      destToken: Address,
      srcAmount: PriceString,
      destAmount: PriceString,
      priceRoute: OptimalRate,
      userAddress: Address,
      partner?: string,
      partnerAddress?: string,
      partnerFeeBps?: number,
      receiver?: Address,
      options?: BuildOptions,
      srcDecimals?: number,
      destDecimals?: number,
      permit?: string,
      deadline?: string
    ) => {
      if (!featureFlags[FeatureGates.SWAP]) {
        throw new Error(`Feature (SWAP) is currently unavailable`);
      }

      const query = new URLSearchParams(options as Record<string, string>);
      const txURL = `${
        (paraswap as any).apiURL
      }/transactions/${network}/?${query.toString()}`;
      const txConfig = {
        srcToken,
        srcDecimals,
        srcAmount,
        destToken,
        destDecimals,
        destAmount,
        priceRoute,
        userAddress,
        partner,
        partnerAddress,
        partnerFeeBps,
        receiver,
        permit,
        deadline,
      };

      const response = await fetch(txURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(txConfig),
      });
      return await response.json();
    },
    [featureFlags, paraswap]
  );

  const swap = useCallback(
    async ({
      srcToken,
      destToken,
      srcDecimals,
      destDecimals,
      srcAmount,
      priceRoute,
      destAmount,
      gasLimit,
      slippage,
    }: SwapParams) => {
      if (!srcToken) {
        throw new Error('Missing parameter: srcToken');
      }

      if (!destToken) {
        throw new Error('Missing parameter: destToken');
      }

      if (!srcAmount) {
        throw new Error('Missing parameter: srcAmount');
      }

      if (!srcDecimals) {
        throw new Error('Missing parameter: srcDecimals');
      }

      if (!destDecimals) {
        throw new Error('Missing parameter: destDecimals');
      }

      if (!destAmount) {
        throw new Error('Missing parameter: destAmount');
      }

      if (!priceRoute) {
        throw new Error('Missing parameter: priceRoute');
      }

      if (!gasLimit) {
        throw new Error('Missing parameter: gasLimit');
      }

      if (!activeNetwork || activeNetwork.isTestnet) {
        throw new Error(`Unsupported network: ${activeNetwork?.chainId}`);
      }

      if (!networkFee) {
        throw new Error('Unknown network fee');
      }

      const srcTokenAddress =
        srcToken === activeNetwork.networkToken.symbol
          ? ETHER_ADDRESS
          : srcToken;
      const destTokenAddress =
        destToken === activeNetwork.networkToken.symbol
          ? ETHER_ADDRESS
          : destToken;

      if (!activeAccount?.addressC) {
        throw new Error('Account address missing');
      }

      if (!avalancheProvider) {
        throw new Error('RPC provider is not available');
      }

      const buildOptions = undefined,
        partnerAddress = undefined,
        partner = 'Avalanche',
        userAddress = activeAccount.addressC,
        receiver = undefined,
        permit = undefined,
        deadline = undefined,
        partnerFeeBps = undefined;

      const spender = await getParaswapSpender();

      let approveTxHash;

      const minAmount = new Big(priceRoute.destAmount)
        .times(1 - slippage / 100)
        .toFixed(0);

      const maxAmount = new Big(srcAmount).times(1 + slippage / 100).toFixed(0);

      //TODO: it may fail when we want to swap erc20 tokens -> investigate
      const sourceAmount = priceRoute.side === 'SELL' ? srcAmount : maxAmount;

      const destinationAmount =
        priceRoute.side === 'SELL' ? minAmount : priceRoute.destAmount;

      // no need to approve AVAX
      if (srcToken !== activeNetwork.networkToken.symbol) {
        const contract = new ethers.Contract(
          srcTokenAddress,
          ERC20.abi,
          avalancheProvider
        );

        if (!contract.allowance) {
          throw new Error(`Allowance Conract Error`);
        }

        const [allowance, allowanceError] = await resolve(
          contract.allowance(userAddress, spender)
        );

        if (allowanceError) {
          throw new Error(`Allowance Error: ${allowanceError}`);
        }

        if (allowance < sourceAmount) {
          const [approveGasLimit] = await resolve(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            contract.approve!.estimateGas(spender, sourceAmount)
          );

          if (allowance < sourceAmount) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { data } = await contract.approve!.populateTransaction(
              spender,
              sourceAmount
            );
            const [hash, signError] = await resolve(
              request<EthSendTransactionHandler>({
                method: DAppProviderRequest.ETH_SEND_TX,
                params: [
                  {
                    chainId: ChainId.AVALANCHE_MAINNET_ID,
                    gasLimit: approveGasLimit
                      ? Number(approveGasLimit)
                      : Number(gasLimit),
                    data,
                    from: activeAccount.addressC,
                    to: srcTokenAddress,
                  },
                ],
              })
            );

            if (signError) {
              throwError(signError);
            }
            approveTxHash = hash;
          } else {
            approveTxHash = [];
          }
        }
      }

      function checkForErrorsInResult(result: Transaction | APIError) {
        return (
          (result as APIError).message === 'Server too busy' ||
          // paraswap returns responses like this: {error: 'Not enough 0x4f60a160d8c2dddaafe16fcc57566db84d674…}
          // when they are too slow to detect the approval
          (result as any).error
        );
      }

      const [txBuildData, txBuildDataError] = await resolve(
        incrementalPromiseResolve(
          () =>
            buildTx(
              ChainId.AVALANCHE_MAINNET_ID.toString(),
              srcTokenAddress,
              destTokenAddress,
              sourceAmount,
              destinationAmount,
              priceRoute,
              userAddress,
              partner,
              partnerAddress,
              partnerFeeBps,
              receiver,
              buildOptions,
              activeNetwork.networkToken.symbol === srcToken ? 18 : srcDecimals,
              activeNetwork.networkToken.symbol === destToken
                ? 18
                : destDecimals,
              permit,
              deadline
            ),
          checkForErrorsInResult,
          0,
          10
        )
      );

      if (txBuildDataError) {
        throw new Error(`Data Error: ${txBuildDataError}`);
      }

      const [swapTxHash, signError] = await resolve(
        request<EthSendTransactionHandler>({
          method: DAppProviderRequest.ETH_SEND_TX,
          params: [
            {
              chainId: ChainId.AVALANCHE_MAINNET_ID,
              gasLimit: Number(txBuildData.gas),
              data: txBuildData.data,
              to: txBuildData.to,
              from: activeAccount.addressC,
              value:
                srcToken === activeNetwork.networkToken.symbol
                  ? `0x${new BN(sourceAmount).toString('hex')}`
                  : undefined, // AVAX value needs to be sent with the transaction
            },
          ],
        })
      );

      if (signError) {
        throwError(signError);
      }

      avalancheProvider.waitForTransaction(swapTxHash).then(async (tx) => {
        const isSuccessful = tx && tx.status === 1;

        captureEncrypted(isSuccessful ? 'SwapSuccessful' : 'SwapFailed', {
          address: userAddress,
          txHash: swapTxHash,
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

        browser.notifications.create({
          type: 'basic',
          title: isSuccessful
            ? t('Swap transaction succeeded! 🎉')
            : t('Swap transaction failed! ❌'),
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
                }
              )
            : t(
                'Could not swap {{srcAmount}} {{srcToken}} to {{destAmount}} {{destToken}}',
                {
                  srcToken: srcAsset,
                  destToken: destAsset,
                  srcAmount: srcAssetAmount,
                  destAmount: destAssetAmount,
                }
              ),
        });
      });

      return {
        swapTxHash,
        approveTxHash,
      };
    },
    [
      activeAccount?.addressC,
      activeNetwork,
      avalancheProvider,
      buildTx,
      captureEncrypted,
      getParaswapSpender,
      networkFee,
      request,
      t,
      findSymbol,
    ]
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

const throwError = (err: string | unknown): never => {
  if (typeof err === 'string') {
    throw new Error(err);
  }

  throw err;
};

export function useSwapContext() {
  return useContext(SwapContext);
}
