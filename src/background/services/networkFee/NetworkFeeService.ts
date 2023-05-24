import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { ethersBigNumberToBig } from '@avalabs/utils-sdk';
import {
  BitcoinProviderAbstract,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { isSwimmer } from '@src/utils/isSwimmerNetwork';
import Big from 'big.js';
import { BigNumber, BigNumberish } from 'ethers';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import {
  EIP1559GasModifier,
  FeeRate,
  NetworkFee,
  NetworkFeeEvents,
  TransactionPriority,
} from './models';

@singleton()
export class NetworkFeeService implements OnUnlock, OnLock {
  private eventEmitter = new EventEmitter();
  private intervalId?: ReturnType<typeof setInterval>;

  private currentNetworkFee: NetworkFee | null = null;

  private evmFeeModifiers: Record<TransactionPriority, EIP1559GasModifier> = {
    low: {
      baseFeeMultiplier: new Big(1.05), // We add additional 5% to account for sudden gas price increases
    },
    medium: {
      baseFeeMultiplier: new Big(1.1),
    },
    high: {
      baseFeeMultiplier: new Big(1.15),
    },
  };

  constructor(private networkService: NetworkService) {}

  private updateFee = async () => {
    const newFee = await this.getNetworkFee();
    const oldFee = this.currentNetworkFee;

    if (newFee && oldFee && newFee.low.maxFee.eq(oldFee.low.maxFee)) {
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
    const {
      lastBaseFeePerGas,
      maxPriorityFeePerGas: lastMaxPriorityFeePerGas,
    } = await (provider as JsonRpcBatchInternal).getFeeData();

    if (lastBaseFeePerGas == null) {
      throw new Error('Fetching fee data failed');
    }

    const baseFee = ethersBigNumberToBig(lastBaseFeePerGas, 0);
    const maxPriorityFeePerGas = ethersBigNumberToBig(
      lastMaxPriorityFeePerGas ?? BigNumber.from(0),
      0
    );

    return {
      displayDecimals: 9, // use Gwei to display amount
      baseFee: lastBaseFeePerGas,
      low: this.getEVMFeeForPriority(baseFee, maxPriorityFeePerGas, 'low'),
      medium: this.getEVMFeeForPriority(
        baseFee,
        maxPriorityFeePerGas,
        'medium'
      ),
      high: this.getEVMFeeForPriority(baseFee, maxPriorityFeePerGas, 'high'),
      isFixedFee: isSwimmer(network) ? true : false,
    };
  }

  private getEVMFeeForPriority(
    baseFee: Big,
    maxPriorityFee: Big,
    priority: TransactionPriority
  ): FeeRate {
    const modifier = this.evmFeeModifiers[priority];
    const maxFee = baseFee.mul(modifier.baseFeeMultiplier);

    // max base fee should be greater than or equal to the max priority fee
    // https://github.com/ava-labs/coreth/blob/26818b3fcdd9831cf31f15c7e65faeecb78f3e70/core/tx_pool.go#L701
    const maxTip = maxPriorityFee.gt(maxFee) ? maxFee : maxPriorityFee;

    return {
      maxFee: BigNumber.from(maxFee.toFixed(0)),
      maxTip: BigNumber.from(maxTip.toFixed(0)),
    };
  }

  private formatBtcFee(rate: number) {
    return {
      maxFee: BigNumber.from(rate),
    };
  }

  async estimateGasLimit(
    from: string,
    to: string,
    data: string,
    value?: BigNumberish,
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
