import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import {
  ExtensionRequest,
  GaslessEvents,
  GaslessMessage,
  GaslessState,
  GaslessStateValues,
} from '@core/types';
import { AppCheckService } from '../appcheck/AppCheckService';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';
import { Signal } from 'micro-signals';
import { JsonRpcProvider, Transaction } from 'ethers';
import { NetworkService } from '../network/NetworkService';
import { getProviderForNetwork } from '@core/common';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';

interface FundTxData {
  chainId: number | string;
  maxFeePerGas?: bigint;
  [key: string]: unknown;
}

@singleton()
export class GasStationService {
  #eventEmitter = new EventEmitter();
  #gasStationUrl = process.env.GASLESS_SERVICE_URL;
  #fundDataPipeline: { fromAddress: string; data: FundTxData }[] = [];
  gaslessState = new Signal<GaslessState>();
  #defaultGaslessState: GaslessState = {
    isFundInProgress: false,
    fundTxHex: '',
    fundTxDoNotRetryError: false,
    solutionHex: '',
    challengeHex: '',
  };
  #gaslessState: GaslessState = this.#defaultGaslessState;

  txHex = '';
  #attempt = 0;
  #sdk: GaslessSdk;
  #retryResolver: ((value: string) => void) | null = null;
  #retryRejecter: ((error: Error) => void) | null = null;

  constructor(
    private appCheckService: AppCheckService,
    private networkService: NetworkService,
    private networkFeeService: NetworkFeeService,
  ) {
    if (!this.#gasStationUrl) {
      throw new Error('GASLESS_SERVICE_URL is missing');
    }
    this.#sdk = new GaslessSdk(this.#gasStationUrl);
  }

  async #getAppcheckToken() {
    const tokenResult = await this.appCheckService.getAppcheckToken();
    return tokenResult?.token;
  }

  async sendMessage(
    message: Record<string, unknown>,
    request: ExtensionRequest,
  ) {
    const token = await this.#getAppcheckToken();
    this.#eventEmitter.emit(GaslessEvents.SEND_OFFSCREEN_MESSAGE, {
      message,
      token,
      request,
    });
  }

  async getEligibility({
    chainId,
    fromAddress,
    nonce,
  }: {
    chainId: string;
    fromAddress?: string;
    nonce?: number;
  }) {
    const token = await this.#getAppcheckToken();
    if (!token) {
      throw new Error('Cannot get the Appcheck Token');
    }
    this.#sdk.setHeaders({
      'X-Firebase-AppCheck': token,
    });
    return await this.#sdk.isEligibleForChain({
      chainId,
      from: fromAddress,
      nonce,
    });
  }

  async setDefaultStateValues(value?: GaslessStateValues) {
    await this.updateState({
      ...this.#defaultGaslessState,
      ...value,
    });
  }

  async updateState(value: GaslessState) {
    this.#gaslessState = {
      ...this.#gaslessState,
      ...value,
    };

    this.gaslessState.dispatch({ ...this.#gaslessState });
  }

  async setHexValuesAndFund({
    challengeHex,
    solutionHex,
    pipelineIndex,
  }: {
    challengeHex: string;
    solutionHex: string;
    pipelineIndex?: number;
  }) {
    await this.setDefaultStateValues({
      challengeHex,
      solutionHex,
    });
    if (pipelineIndex === 0 || pipelineIndex) {
      try {
        const pipelineData = this.#fundDataPipeline[pipelineIndex];
        if (!pipelineData) {
          throw new Error('No data for funding.');
        }
        const result = await this.fundTx({
          challengeHex,
          solutionHex,
          data: pipelineData.data,
          fromAddress: pipelineData?.fromAddress,
        });
        this.#retryResolver?.(result);
      } catch (e) {
        this.#retryRejecter?.(e as Error);
        this.setDefaultStateValues({ fundTxDoNotRetryError: true });
      } finally {
        this.#retryResolver = null;
        this.#retryRejecter = null;
      }
    }
  }

  async fetchAndSolveChallange(pipelineIndex?: number) {
    await this.sendMessage(
      { pipelineIndex },
      ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
    );
  }

  async fundTx({
    data,
    challengeHex,
    solutionHex,
    fromAddress,
  }: {
    data: FundTxData;
    challengeHex: string;
    solutionHex: string;
    fromAddress: string;
  }): Promise<string> {
    await this.setDefaultStateValues({
      isFundInProgress: true,
      challengeHex,
      solutionHex,
    });
    this.#attempt++;

    const token = await this.#getAppcheckToken();
    if (!token) {
      throw new Error('Cannot get Appcheck Token');
    }
    this.#sdk.setHeaders({
      'X-Firebase-AppCheck': token,
    });

    const network = await this.networkService.getNetwork(data.chainId);
    if (!network) {
      throw new Error('No network');
    }

    const networkFee = await this.networkFeeService.getNetworkFee(network);

    const maxFeePerGas = networkFee?.medium.maxFeePerGas || data.maxFeePerGas;

    const txHex = Transaction.from({
      ...data,
      maxFeePerGas,
      from: null,
    }).unsignedSerialized;

    this.txHex = txHex;
    const result = await this.#sdk.fundTx({
      challengeHex,
      solutionHex,
      txHex,
      from: fromAddress,
    });

    if (result.error) {
      if (
        result.error.category === 'RETRY_WITH_NEW_CHALLENGE' &&
        this.#attempt < 2
      ) {
        if (this.#retryResolver) {
          throw new Error('A gasless retry is already in progress');
        }

        const nextPipelineIndex = this.#fundDataPipeline.length;

        this.#fundDataPipeline.push({ data, fromAddress });

        const retryPromise = new Promise<string>((resolve, reject) => {
          this.#retryResolver = resolve;
          this.#retryRejecter = reject;
        });

        await this.fetchAndSolveChallange(nextPipelineIndex);
        return retryPromise;
      }
      this.setDefaultStateValues({ fundTxDoNotRetryError: true });
      this.#attempt = 0;
      this.#fundDataPipeline = [];

      throw new Error(
        result.error.message === 'UNAUTHORIZED'
          ? 'Gasless funding unauthorized'
          : `Gasless funding failed: ${result.error.message ?? result.error.category}`,
      );
    }
    if (!result.txHash) {
      throw new Error('No tx hash');
    }
    const provider = await getProviderForNetwork(network);
    const waitForTransactionResult = await (
      provider as JsonRpcProvider
    ).waitForTransaction(result.txHash);

    if (!waitForTransactionResult?.hash) {
      throw new Error('Gasless funding transaction not confirmed');
    }
    const fundedTxHash = waitForTransactionResult.hash;

    this.setDefaultStateValues({
      solutionHex,
      challengeHex,
      fundTxHex: fundedTxHash,
    });
    this.#attempt = 0;
    this.#fundDataPipeline = [];

    return fundedTxHash;
  }

  addListener(event: GaslessEvents, callback: (data: GaslessMessage) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
