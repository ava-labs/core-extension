import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { GaslessEvents, GaslessMessage } from './model';
import { AppCheckService } from '../appcheck/AppCheckService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GaslessSdk } from '@avalabs/core-gasless-sdk';
import { Signal } from 'micro-signals';
import { JsonRpcProvider, Transaction } from 'ethers';
import { NetworkService } from '../network/NetworkService';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
@singleton()
export class GasStationService {
  #eventEmitter = new EventEmitter();
  #gasStationUrl = 'https://core-gas-station.avax-test.network';
  solutionHex = new Signal<string | undefined>();
  challengeHex = new Signal<string | undefined>();
  fundTxHex = new Signal<string | undefined>();
  fundTxDoNotRertyError = new Signal<boolean | undefined>();
  isFundProcessReady = new Signal<boolean>();
  #fundDataPipeline: { fromAddress: string; data: any }[] = [];

  txHex = '';
  #attempt = 0;
  #sdk: GaslessSdk;

  constructor(
    private appCheckService: AppCheckService,
    private networkService: NetworkService,
  ) {
    this.#sdk = new GaslessSdk(this.#gasStationUrl);
    this.createOffScreen();
  }

  async #getAppcheckToken() {
    const tokenResult = await this.appCheckService.getAppcheckToken();
    return tokenResult?.token;
  }

  async createOffScreen() {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['WORKERS'],
      justification: 'offload computation',
    });
  }

  async closeOffscreen() {
    await chrome.offscreen.closeDocument();
    return true;
  }

  //TODO: "maybe" don't need the message param
  async sendMessage(message, request: ExtensionRequest) {
    const token = await this.#getAppcheckToken();
    this.#eventEmitter.emit(GaslessEvents.SEND_MESSAGE, {
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
    this.#sdk.setAppCheckToken(token);
    return await this.#sdk.isEligibleForChain({
      chainId,
      from: fromAddress,
      nonce,
    });
  }

  async setChallengeHex(
    challengeHex: string,
    solutionHex: string,
    pipelineIndex?: number,
  ) {
    this.challengeHex.dispatch(challengeHex);
    this.solutionHex.dispatch(solutionHex);
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
        this.fundTxDoNotRertyError.dispatch(true);
      }
    }
    // await this.closeOffscreen();
  }

  setDefaultValues() {
    console.log('setDefaultValues: ');
    this.isFundProcessReady.dispatch(false);
    this.fundTxHex.dispatch(undefined);
  }

  async fetchChallange(pipelineIndex?: number) {
    await this.sendMessage(
      { pipelineIndex },
      ExtensionRequest.GASLESS_FETCH_CHALLENGE,
    );
  }

  async fundTx({ data, challengeHex, solutionHex, fromAddress }) {
    this.isFundProcessReady.dispatch(false);
    this.#attempt++;

    const token = await this.#getAppcheckToken();
    if (!token) {
      throw new Error('Cannot get Appcheck Token');
    }
    this.#sdk.setAppCheckToken(token);

    const txHex = Transaction.from({
      ...data,
      from: null,
    }).unsignedSerialized;

    this.txHex = txHex;
    const result = await this.#sdk.fundTx({
      challengeHex,
      solutionHex,
      txHex,
      from: fromAddress,
    });
    const network = await this.networkService.getNetwork(data.chainId);
    if (!network) {
      throw new Error('No network');
    }
    if (result.error) {
      if (
        result.error.category === 'RETRY_WITH_NEW_CHALLENGE' &&
        this.#attempt < 2
      ) {
        const nextPipelineIndex = this.#fundDataPipeline.length;

        this.#fundDataPipeline.push({ data, fromAddress });

        await this.fetchChallange(nextPipelineIndex);
      }
      this.fundTxDoNotRertyError.dispatch(true);
      return;
    }
    if (!result.txHash) {
      throw new Error('No tx hash');
    }
    const provider = await getProviderForNetwork(network);
    const waitForTransactionResult = await (
      provider as JsonRpcProvider
    ).waitForTransaction(result.txHash);
    this.solutionHex.dispatch(solutionHex);
    this.challengeHex.dispatch(challengeHex);
    this.fundTxHex.dispatch(waitForTransactionResult?.hash);
    this.isFundProcessReady.dispatch(true);
  }

  addListener(event: GaslessEvents, callback: (data: GaslessMessage) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
