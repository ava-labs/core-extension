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
  txHex = '';
  #sdk: GaslessSdk;

  constructor(
    private appCheckService: AppCheckService,
    private networkService: NetworkService,
  ) {
    this.#sdk = new GaslessSdk(this.#gasStationUrl);
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

  async getEligibility(chainId: string) {
    const token = await this.#getAppcheckToken();
    if (!token) {
      throw new Error('Cannot get Appcheck Token');
    }
    this.#sdk.setAppCheckToken(token);
    return await this.#sdk.isEligibleForChain(chainId);
  }

  async setChallengeHex(challengeHex: string, solutionHex: string) {
    this.solutionHex.dispatch(solutionHex);
    this.challengeHex.dispatch(challengeHex);
  }

  async fetchChallange() {
    await this.createOffScreen();
    await this.sendMessage(null, ExtensionRequest.GASLESS_FETCH_CHALLENGE);
  }

  async fundTx({ data, challengeHex, solutionHex, fromAddress }) {
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
      throw new Error(result.error.category);
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
    await this.closeOffscreen();
    return waitForTransactionResult?.hash;
  }

  addListener(event: GaslessEvents, callback: (data: GaslessMessage) => void) {
    this.#eventEmitter.on(event, callback);
  }
}
