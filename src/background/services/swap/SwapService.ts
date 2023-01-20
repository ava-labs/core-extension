import { ChainId } from '@avalabs/chains-sdk';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import {
  ParaSwap,
  APIError,
  Transaction,
  BuildOptions,
  Address,
  PriceString,
} from 'paraswap';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { singleton } from 'tsyringe';
import Web3 from 'web3';
import { AccountsService } from '../accounts/AccountsService';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { NetworkService } from '../network/NetworkService';
import {
  hasParaswapError,
  ParaswapPricesResponse,
  PARASWAP_RETRYABLE_ERRORS,
} from './models';

const NETWORK_UNSUPPORTED_ERROR = new Error(
  'Fuji network is not supported by Paraswap'
);

@singleton()
export class SwapService {
  private paraSwap = new ParaSwap(
    ChainId.AVALANCHE_MAINNET_ID,
    undefined,
    new Web3()
  );

  public get apiUrl(): string {
    return (this.paraSwap as any).apiURL;
  }

  constructor(
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private featureFlagService: FeatureFlagService
  ) {}

  async getSwapRate(
    srcToken: string,
    srcDecimals: number,
    destToken: string,
    destDecimals: number,
    srcAmount: string,
    swapSide?: SwapSide
  ) {
    if (!this.networkService.isMainnet()) {
      throw NETWORK_UNSUPPORTED_ERROR;
    }
    if (!this.accountsService.activeAccount) {
      throw new Error('Account address missing');
    }

    this.featureFlagService.ensureFlagEnabled(FeatureGates.SWAP);

    const activeNetwork = this.networkService.activeNetwork;

    const query = new URLSearchParams({
      srcToken,
      destToken,
      amount: srcAmount,
      side: swapSide || SwapSide.SELL,
      network: ChainId.AVALANCHE_MAINNET_ID.toString(),
      srcDecimals: `${
        activeNetwork?.networkToken.symbol === srcToken ? 18 : srcDecimals
      }`,
      destDecimals: `${
        activeNetwork?.networkToken.symbol === destToken ? 18 : destDecimals
      }`,
      userAddress: this.accountsService.activeAccount.addressC,
    });

    // apiURL is a private property
    const url = `${this.apiUrl}/prices/?${query.toString()}`;

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
        } else {
          // If an error occurred, but there is no point in retrying a request,
          // we need to propagate the error so we're able to show an approriate
          // message in the UI.
          throw new Error(isFetchError ? response.message : response.error);
        }
      }

      return false;
    }

    const result = await incrementalPromiseResolve<ParaswapPricesResponse>(
      () => optimalRates(),
      checkForErrorsInResult
    );

    return result.priceRoute;
  }

  async getParaswapSpender(): Promise<string> {
    this.featureFlagService.ensureFlagEnabled(FeatureGates.SWAP);

    const response = await fetch(
      `${this.apiUrl}/adapters/contracts?network=${ChainId.AVALANCHE_MAINNET_ID}`
    );

    const result = await response.json();
    return result.TokenTransferProxy;
  }

  async buildTx(
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
  ): Promise<APIError | Transaction> {
    this.featureFlagService.ensureFlagEnabled(FeatureGates.SWAP);

    const query = new URLSearchParams(options as Record<string, string>);
    const txURL = `${this.apiUrl}/transactions/${network}/?${query.toString()}`;
    const txConfig = {
      priceRoute,
      srcToken,
      destToken,
      srcAmount,
      destAmount,
      userAddress,
      partner,
      partnerAddress,
      partnerFeeBps,
      receiver,
      srcDecimals,
      destDecimals,
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
  }
}
