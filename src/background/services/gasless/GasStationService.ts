import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import {
  GaslessEvents,
  GaslessMessage,
  GaslessState,
  GaslessStateValues,
} from './model';
import { AppCheckService } from '../appcheck/AppCheckService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';
import { Signal } from 'micro-signals';
import { JsonRpcProvider, Transaction } from 'ethers';
import { NetworkService } from '../network/NetworkService';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
@singleton()
export class GasStationService {
  #eventEmitter = new EventEmitter();
  #gasStationUrl = process.env.GASLESS_SERVICE_URL;
  #fundDataPipeline: { fromAddress: string; data: any }[] = [];
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
  #eligibilityCache = {};
  #waitingForEligibilityList: {
    chainId: string;
    fromAddress?: string;
    nonce?: number;
  }[] = [];

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

  async sendMessage(message, request: ExtensionRequest) {
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
    index,
  }: {
    chainId: string;
    fromAddress?: string;
    nonce?: number;
    index?: number;
  }) {
    const token = await this.#getAppcheckToken();
    const chacheKey = `${chainId}${token}`;

    if (this.#eligibilityCache[chacheKey] && !fromAddress && !nonce) {
      return this.#eligibilityCache[chacheKey];
    }

    // handle the multiple eligibility requests
    if (!index && index !== 0) {
      const data = { chainId, fromAddress, nonce };
      this.#waitingForEligibilityList.push(data);
      console.log('he');
      return await this.getEligibility({
        ...data,
        index: 0,
      });
    }

    if (!token) {
      throw new Error('Cannot get the Appcheck Token');
    }
    this.#sdk.setAppCheckToken(token);
    const eligibility = await this.#sdk.isEligibleForChain({
      chainId,
      from: fromAddress,
      nonce,
    });

    // cache the result if there is only the chainId
    // We only request the eligibility by chainId when we want to have a clue the user maybe can get the gas fee before we are actually get any transaction details
    // TLDR; we want to know thisroughly before an actual transaction
    if (!fromAddress && !nonce) {
      this.#eligibilityCache = {
        ...this.#eligibilityCache,
        [chacheKey]: eligibility,
      };
    }

    this.#waitingForEligibilityList.splice(index, 1);
    const nextEligibilityCheckData = this.#waitingForEligibilityList[0];
    if (nextEligibilityCheckData) {
      return await this.getEligibility({
        chainId: nextEligibilityCheckData.chainId,
        fromAddress: nextEligibilityCheckData.fromAddress,
        nonce: nextEligibilityCheckData.nonce,
        index: 0,
      });
    }

    return eligibility;
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
      const pipelineData = this.#fundDataPipeline[pipelineIndex];
      if (!pipelineData) {
        throw new Error('No data for funding.');
      }
      try {
        await this.fundTx({
          challengeHex,
          solutionHex,
          data: pipelineData.data,
          fromAddress: pipelineData?.fromAddress,
        });
      } catch (_) {
        this.setDefaultStateValues({ fundTxDoNotRetryError: true });
      }
    }
  }

  async fetchAndSolveChallange(pipelineIndex?: number) {
    await this.sendMessage(
      { pipelineIndex },
      ExtensionRequest.GASLESS_FETCH_AND_SOLVE_CHALLENGE,
    );
  }

  async fundTx({ data, challengeHex, solutionHex, fromAddress }) {
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
    this.#sdk.setAppCheckToken(token);

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
        const nextPipelineIndex = this.#fundDataPipeline.length;

        this.#fundDataPipeline.push({ data, fromAddress });

        await this.fetchAndSolveChallange(nextPipelineIndex);
        return;
      }
      this.setDefaultStateValues({ fundTxDoNotRetryError: true });
      this.#attempt = 0;
      this.#fundDataPipeline = [];
      return;
    }
    if (!result.txHash) {
      throw new Error('No tx hash');
    }
    const provider = await getProviderForNetwork(network);
    const waitForTransactionResult = await (
      provider as JsonRpcProvider
    ).waitForTransaction(result.txHash);
    this.setDefaultStateValues({
      solutionHex,
      challengeHex,
      fundTxHex: waitForTransactionResult?.hash,
    });
    this.#attempt = 0;
    this.#fundDataPipeline = [];
  }

  addListener(event: GaslessEvents, callback: (data: GaslessMessage) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
