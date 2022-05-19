import {
  BitcoinProviderAbstract,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import Big from 'big.js';
import { BigNumber } from 'ethers';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkEvents, NetworkVM } from '../network/models';
import { NetworkService } from '../network/NetworkService';
import { NetworkFee, NetworkFeeEvents } from './models';

@singleton()
export class NetworkFeeService implements OnUnlock, OnLock {
  private eventEmitter = new EventEmitter();
  private intervalId?: ReturnType<typeof setInterval>;

  private currentNetworkFee: NetworkFee | null = null;

  constructor(private networkService: NetworkService) {
    this.networkService.addListener(
      NetworkEvents.NETWORK_UPDATE_EVENT,
      this.updateFee.bind(this)
    );
  }

  private async updateFee() {
    const newFee = await this.getNetworkFee();
    if (newFee && this.currentNetworkFee?.low.eq(newFee.low)) {
      return;
    }
    this.currentNetworkFee = newFee;
    this.eventEmitter.emit(
      NetworkFeeEvents.NETWORK_FEE_UPDATED,
      this.currentNetworkFee
    );
  }

  onUnlock(): void | Promise<void> {
    this.intervalId = setInterval(async () => {
      this.updateFee();
    }, 30000);
  }

  onLock() {
    this.intervalId && clearInterval(this.intervalId);
    this.currentNetworkFee = null;
  }

  async getNetworkFee(): Promise<NetworkFee | null> {
    const provider = this.networkService.activeProvider;

    if (!provider || !this.networkService.activeNetwork) {
      return null;
    }

    if (this.networkService.activeNetwork.vm === NetworkVM.EVM) {
      const price = await (provider as JsonRpcBatchInternal).getGasPrice();
      const bigPrice = new Big(price.toString());

      return {
        low: price,
        medium: BigNumber.from(bigPrice.mul(1.05).toFixed(0)),
        high: BigNumber.from(bigPrice.mul(1.15).toFixed(0)),
      };
    } else if (this.networkService.activeNetwork.vm === NetworkVM.BITCOIN) {
      const rates = await (provider as BitcoinProviderAbstract).getFeeRates();
      return {
        low: BigNumber.from(rates.low),
        medium: BigNumber.from(rates.medium),
        high: BigNumber.from(rates.high),
      };
    }

    return null;
  }

  async estimateGasLimit(
    from: string,
    to: string,
    data: string
  ): Promise<number | null> {
    if (this.networkService.activeNetwork?.vm !== NetworkVM.EVM) {
      return null;
    }
    const provider = this.networkService.activeProvider;

    const nonce = await (provider as JsonRpcBatchInternal).getTransactionCount(
      from
    );

    return (
      await (provider as JsonRpcBatchInternal).estimateGas({
        from: from,
        nonce: nonce,
        to: to,
        data: data,
      })
    ).toNumber();
  }

  addListener(event: NetworkFeeEvents, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }
}
