import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import {
  BitcoinProviderAbstract,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import Big from 'big.js';
import { BigNumber, BigNumberish } from 'ethers';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { NetworkFee, NetworkFeeEvents } from './models';

@singleton()
export class NetworkFeeService implements OnUnlock, OnLock {
  private eventEmitter = new EventEmitter();
  private intervalId?: ReturnType<typeof setInterval>;

  private currentNetworkFee: NetworkFee | null = null;

  constructor(private networkService: NetworkService) {}

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
    this.networkService.activeNetwork.add(this.updateFee.bind(this));
    this.intervalId = setInterval(async () => {
      this.updateFee();
    }, 30000);
  }

  onLock() {
    this.networkService.activeNetwork.remove(this.updateFee.bind(this));
    this.intervalId && clearInterval(this.intervalId);
    this.currentNetworkFee = null;
  }

  async getNetworkFee(otherNetwork?: Network): Promise<NetworkFee | null> {
    const network =
      otherNetwork || (await this.networkService.activeNetwork.promisify());

    if (!network) {
      return null;
    }
    const provider = this.networkService.getProviderForNetwork(network);

    if (network.vmName === NetworkVMType.EVM) {
      const price = await (provider as JsonRpcBatchInternal).getGasPrice();
      const bigPrice = new Big(price.toString());

      return {
        displayDecimals: 9, // use gwei to display amount
        low: price,
        medium: BigNumber.from(bigPrice.mul(1.05).toFixed(0)),
        high: BigNumber.from(bigPrice.mul(1.15).toFixed(0)),
      };
    } else if (network.vmName === NetworkVMType.BITCOIN) {
      const rates = await (provider as BitcoinProviderAbstract).getFeeRates();
      return {
        displayDecimals: 0, // display btc fees in satoshi
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
    data: string,
    value?: BigNumberish
  ): Promise<number | null> {
    const network = await this.networkService.activeNetwork.promisify();
    if (network?.vmName !== NetworkVMType.EVM) {
      return null;
    }
    const provider = this.networkService.getProviderForNetwork(network);

    const nonce = await (provider as JsonRpcBatchInternal).getTransactionCount(
      from
    );

    return (
      await (provider as JsonRpcBatchInternal).estimateGas({
        from: from,
        nonce: nonce,
        to: to,
        data: data,
        value,
      })
    ).toNumber();
  }

  addListener(event: NetworkFeeEvents, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }
}
