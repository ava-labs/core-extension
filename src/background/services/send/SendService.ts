import { NetworkVMType } from '@avalabs/chains-sdk';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { WalletService } from '../wallet/WalletService';
import {
  isValidSendState,
  SendEvent,
  SendServiceHelper,
  SendState,
} from './models';
import { SendServiceBTC } from './SendServiceBTC';
import { SendServiceEVM as SendServiceEVM } from './SendServiceEVM';

@singleton()
export class SendService {
  private eventEmitter = new EventEmitter();

  constructor(
    private sendServiceBTC: SendServiceBTC,
    private sendServiceEVM: SendServiceEVM,
    private networkService: NetworkService,
    private walletService: WalletService
  ) {}

  transactionUpdated(txData: { txId: string }) {
    this.eventEmitter.emit(SendEvent.TX_DETAILS, txData);
  }

  async send(sendState: SendState, tabId?: number): Promise<string> {
    const service = await this.getService();
    sendState = await service.validateStateAndCalculateFees(sendState);

    if (sendState.error?.error) {
      throw new Error(sendState.error.message);
    }

    if (!isValidSendState(sendState)) {
      throw new Error('Unknown error, unable to submit');
    }

    const txRequest = await service.getTransactionRequest(sendState);
    const signedTx = await this.walletService.sign(txRequest, tabId);
    const txId = await this.networkService.sendTransaction(signedTx);
    this.transactionUpdated({ txId });
    return txId;
  }

  async validateStateAndCalculateFees(
    sendState: SendState
  ): Promise<SendState> {
    const service = this.getService();
    return service.validateStateAndCalculateFees(sendState);
  }

  addListener(event: SendEvent, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }

  private getService(): SendServiceHelper {
    const activeNetwork = this.networkService.activeNetwork;
    switch (activeNetwork?.vmName) {
      case NetworkVMType.BITCOIN:
        return this.sendServiceBTC;
      case NetworkVMType.EVM:
        return this.sendServiceEVM;
      default:
        throw new Error('unhandled send helper');
    }
  }
}
