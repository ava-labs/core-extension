import { GasHelper, web3 } from '@avalabs/avalanche-wallet-sdk';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { GasPrice, NetworkFeeEvents } from './models';

@singleton()
export class NetworkFeeService {
  private eventEmitter = new EventEmitter();

  private currentNetworkFee?: GasPrice;

  activate() {
    setInterval(async () => {
      const newFee = await this.getNetworkFee();
      if (this.currentNetworkFee?.bn.eq(newFee.bn)) {
        return;
      }
      this.currentNetworkFee = newFee;
      this.eventEmitter.emit(
        NetworkFeeEvents.NETWORK_FEE_UPDATED,
        this.currentNetworkFee
      );
    }, 30000);
  }

  async getNetworkFee(): Promise<GasPrice> {
    const price = await GasHelper.getAdjustedGasPrice();
    return {
      bn: price,
      value: bnToLocaleString(price, 9),
    };
  }

  async estimateGasLimit(
    from: string,
    to: string,
    data: string
  ): Promise<number> {
    const nonce = await web3.eth.getTransactionCount(from);
    return await web3.eth.estimateGas({
      from: from,
      nonce: nonce,
      to: to,
      data: data,
    });
  }

  addListener(event: NetworkFeeEvents, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }
}
