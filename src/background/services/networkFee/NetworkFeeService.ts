import { NetworkVMType } from '@avalabs/chains-sdk';
import {
  BitcoinProviderAbstract,
  JsonRpcBatchInternal,
} from '@avalabs/wallets-sdk';
import { isSwimmer } from '@src/utils/isSwimmerNetwork';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { FeeRate, NetworkFee, TransactionPriority } from './models';
import { Network } from '../network/models';

const EVM_BASE_TIP = BigInt(5e8); // 0.5 Gwei
const EVM_TIP_MODIFIERS: Record<TransactionPriority, bigint> = {
  low: 1n, // use the base tip
  medium: 4n, // 4x base
  high: 6n, // 6x base
};

@singleton()
export class NetworkFeeService {
  constructor(private networkService: NetworkService) {}

  async getNetworkFee(network: Network): Promise<NetworkFee | null> {
    const provider = getProviderForNetwork(network);

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
    network: Network,
    value?: bigint
  ): Promise<number | null> {
    if (network.vmName !== NetworkVMType.EVM) {
      return null;
    }

    const provider = getProviderForNetwork(network);
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
}
