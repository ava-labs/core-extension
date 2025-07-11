import Joi from 'joi';
import {
  constructFetchFetcher,
  constructGetSpender,
  constructSimpleSDK,
  OptimalRate,
  Address,
  SwapSide,
  TransactionParams,
} from '@paraswap/sdk';
import { ParaSwapVersion } from '@paraswap/core';
import { SimpleFetchSDK } from '@paraswap/sdk/dist/sdk/simple';
import { ChainId } from '@avalabs/core-chains-sdk';
import { Account, NetworkWithCaipId, SwapErrorCode } from '@core/types';
import { NATIVE_TOKEN_ADDRESS } from '../constants';
import { BuildTxParams, isAPIError, ValidTransactionResponse } from '../models';
import { swapError } from '../swap-utils';

const txResponseSchema = Joi.object<ValidTransactionResponse>({
  to: Joi.string().required(),
  from: Joi.string().required(),
  value: Joi.string().required(),
  data: Joi.string().required(),
  chainId: Joi.number().required(),
  gas: Joi.string().optional(),
  gasPrice: Joi.string().optional(),
}).unknown();

const TESTNET_NETWORK_UNSUPPORTED_ERROR = new Error(
  'Testnet network is not supported by Paraswap',
);

interface SwapRate {
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  srcAmount: string;
  swapSide: SwapSide;
  network: NetworkWithCaipId;
  account: Account;
  abortSignal?: AbortSignal;
}

const SUPPORTED_SWAP_NETWORKS = [
  ChainId.AVALANCHE_MAINNET_ID,
  ChainId.ETHEREUM_HOMESTEAD, // todo: deploy wrapper contracts for these chains

  // Chains below are supported by Paraswap but not used in the app
  // ChainId.ETHEREUM_HOMESTEAD,
  // ChainId.POLYGON,
  // ChainId.FANTOM,
  // ChainId.BNB,
  // ChainId.ARBITRUM,
  // ChainId.OPTIMISM,
  // ChainId.POLYGON_ZK_EVM,
  // ChainId.BASE
  // POLYGON = 137,
  // FANTOM = 250,
  // BNB = 56,
  // ARBITRUM = 42161,
  // OPTIMISM = 69,
  // POLYGON_ZK_EVM = 1101,
  // BASE = 8453,
];

class ParaswapService {
  private getParaSwapSDK = (chainId: number): SimpleFetchSDK => {
    return constructSimpleSDK({
      chainId,
      fetch,
      version: ParaSwapVersion.V6,
    });
  };

  async getSwapRate({
    srcToken,
    srcDecimals,
    destToken,
    destDecimals,
    srcAmount,
    swapSide,
    network,
    account,
    abortSignal,
  }: SwapRate): Promise<OptimalRate> {
    if (!SUPPORTED_SWAP_NETWORKS.includes(network.chainId)) {
      throw new Error(`${network.chainName} is not supported by Paraswap`);
    }

    const isFromTokenNative = network.networkToken.symbol === srcToken;
    const isDestTokenNative = network.networkToken.symbol === destToken;

    return await this.getParaSwapSDK(network.chainId).swap.getRate(
      {
        srcToken: isFromTokenNative ? NATIVE_TOKEN_ADDRESS : srcToken,
        destToken: isDestTokenNative ? NATIVE_TOKEN_ADDRESS : destToken,
        amount: srcAmount,
        userAddress: account.addressC,
        side: swapSide,
        srcDecimals,
        destDecimals,
      },
      abortSignal,
    );
  }

  async getParaswapSpender(network: NetworkWithCaipId): Promise<Address> {
    if (network.isTestnet) {
      throw TESTNET_NETWORK_UNSUPPORTED_ERROR;
    }
    if (!SUPPORTED_SWAP_NETWORKS.includes(network.chainId)) {
      throw new Error(`${network.chainName} is not supported by Paraswap`);
    }
    const fetcher = constructFetchFetcher(fetch);
    const { getSpender } = constructGetSpender({
      apiURL: this.getParaSwapSDK(network.chainId).apiURL,
      chainId: ChainId.AVALANCHE_MAINNET_ID,
      version: ParaSwapVersion.V6,
      fetcher,
    });
    return getSpender();
  }

  async buildTx({
    network,
    srcToken,
    destToken,
    srcAmount,
    destAmount,
    priceRoute,
    userAddress,
    partner,
    partnerAddress,
    partnerFeeBps,
    isDirectFeeTransfer,
    srcDecimals,
    destDecimals,
    ignoreChecks,
  }: BuildTxParams): Promise<TransactionParams> {
    if (network.isTestnet) {
      throw TESTNET_NETWORK_UNSUPPORTED_ERROR;
    }
    if (!SUPPORTED_SWAP_NETWORKS.includes(network.chainId)) {
      throw new Error(`${network.chainName} is not supported by Paraswap`);
    }

    const response = await this.getParaSwapSDK(network.chainId).swap.buildTx(
      {
        srcToken,
        destToken,
        srcAmount,
        destAmount,
        priceRoute,
        userAddress,
        partner,
        partnerAddress,
        partnerFeeBps,
        isDirectFeeTransfer,
        srcDecimals,
        destDecimals,
      },
      { ignoreChecks },
    );

    const result = txResponseSchema.validate(response);

    if (result.error) {
      if (isAPIError(result)) {
        throw swapError(SwapErrorCode.ApiError, new Error(result.message));
      }
      throw swapError(SwapErrorCode.UnexpectedApiResponse, result.error);
    }

    return result.value;
  }
}

export default new ParaswapService();
