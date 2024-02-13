import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import {
  BitcoinProviderAbstract,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { isSwimmer } from '@src/utils/isSwimmerNetwork';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import {
  FeeRate,
  NetworkFee,
  NetworkFeeEvents,
  TransactionPriority,
} from './models';

const EVM_BASE_TIP = BigInt(5e8); // 0.5 Gwei
const EVM_TIP_MODIFIERS: Record<TransactionPriority, bigint> = {
  low: 1n, // use the base tip
  medium: 4n, // 4x base
  high: 6n, // 6x base
};

@singleton()
export class NetworkFeeService implements OnUnlock, OnLock {
  private eventEmitter = new EventEmitter();
  private intervalId?: ReturnType<typeof setInterval>;

  private currentNetworkFee: NetworkFee | null = null;

  constructor(private networkService: NetworkService) {}

  private updateFee = async () => {
    let newFee: NetworkFee | null = null;
    try {
      newFee = await this.getNetworkFee();
    } catch (e) {
      return;
    }
    const oldFee = this.currentNetworkFee;

    if (newFee && oldFee && newFee.low.maxFee === oldFee.low.maxFee) {
      return;
    }

    this.currentNetworkFee = newFee;
    this.eventEmitter.emit(
      NetworkFeeEvents.NETWORK_FEE_UPDATED,
      this.currentNetworkFee
    );
  };

  onUnlock(): void | Promise<void> {
    this.networkService.activeNetworkChanged.add(this.updateFee);
    // Update fees as soon as wallet is unlocked
    this.updateFee();

    // Then schedule automatic updates every X seconds
    this.intervalId = setInterval(async () => {
      this.updateFee();
    }, 30000);
  }

  onLock() {
    this.networkService.activeNetworkChanged.remove(this.updateFee);
    this.intervalId && clearInterval(this.intervalId);
    this.currentNetworkFee = null;
  }

  async getNetworkFee(otherNetwork?: Network): Promise<NetworkFee | null> {
    const network = otherNetwork || this.networkService.activeNetwork;

    if (!network) {
      return null;
    }
    const provider = this.networkService.getProviderForNetwork(network);

    if (network.vmName === NetworkVMType.EVM) {
      return this.getEip1559NetworkFeeRates(
        network,
        provider as JsonRpcBatchInternal
      );
    } else if (network.vmName === NetworkVMType.BITCOIN) {
      const rates = await (provider as BitcoinProviderAbstract).getFeeRates();
      return {
        displayDecimals: 0, // display btc fees in satoshi
        low: this.formatBtcFee(rates.low),
        medium: this.formatBtcFee(rates.medium),
        high: this.formatBtcFee(rates.high),
        isFixedFee: false,
      };
    }

    return null;
  }

  private async getEip1559NetworkFeeRates(
    network: Network,
    provider: JsonRpcBatchInternal
  ): Promise<NetworkFee> {
    const { maxFeePerGas: baseMaxFee } = await (
      provider as JsonRpcBatchInternal
    ).getFeeData();

    if (baseMaxFee === null) {
      throw new Error('Fetching fee data failed');
    }

    return {
      displayDecimals: 9, // use Gwei to display amount
      baseMaxFee,
      low: this.getEVMFeeForPriority(baseMaxFee, EVM_BASE_TIP, 'low'),
      medium: this.getEVMFeeForPriority(baseMaxFee, EVM_BASE_TIP, 'medium'),
      high: this.getEVMFeeForPriority(baseMaxFee, EVM_BASE_TIP, 'high'),
      isFixedFee: isSwimmer(network) ? true : false,
    };
  }

  private getEVMFeeForPriority(
    baseMaxFee: bigint,
    maxPriorityFee: bigint,
    priority: TransactionPriority
  ): FeeRate {
    const maxTip = maxPriorityFee * EVM_TIP_MODIFIERS[priority];
    const maxFee = baseMaxFee + maxTip;

    return {
      maxFee,
      maxTip,
    };
  }

  private formatBtcFee(rate: number) {
    return {
      maxFee: BigInt(rate),
    };
  }

  async estimateGasLimit(
    from: string,
    to: string,
    data: string,
    value?: bigint,
    otherNetwork?: Network
  ): Promise<number | null> {
    const network = otherNetwork ?? this.networkService.activeNetwork;

    if (network?.vmName !== NetworkVMType.EVM) {
      return null;
    }

    const provider = this.networkService.getProviderForNetwork(network);
    const nonce = await (provider as JsonRpcBatchInternal).getTransactionCount(
      from
    );

    return Number(
      await (provider as JsonRpcBatchInternal).estimateGas({
        from: from,
        nonce: nonce,
        to: to,
        data: data,
        value,
      })
    );
  }

  addListener(event: NetworkFeeEvents, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }
}
