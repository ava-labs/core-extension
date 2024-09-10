import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { isSwimmer } from '@src/utils/isSwimmerNetwork';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { singleton } from 'tsyringe';
import { FeeRate, NetworkFee, TransactionPriority } from './models';
import { NetworkWithCaipId } from '../network/models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';

const EVM_BASE_TIP = BigInt(5e8); // 0.5 Gwei
const EVM_TIP_MODIFIERS: Record<TransactionPriority, bigint> = {
  low: 1n, // use the base tip
  medium: 4n, // 4x base
  high: 6n, // 6x base
};

@singleton()
export class NetworkFeeService {
  constructor(private moduleManager: ModuleManager) {}

  async getNetworkFee(network: NetworkWithCaipId): Promise<NetworkFee | null> {
    if (network.vmName === NetworkVMType.EVM) {
      const provider = getProviderForNetwork(network);
      return this.getEip1559NetworkFeeRates(
        network,
        provider as JsonRpcBatchInternal
      );
    } else if (network.vmName === NetworkVMType.BITCOIN) {
      const module = await this.moduleManager.loadModuleByNetwork(network);
      const { low, medium, high, isFixedFee } = await module.getNetworkFee(
        network
      );

      return {
        isFixedFee,
        low: {
          maxFee: low.maxFeePerGas,
        },
        medium: {
          maxFee: medium.maxFeePerGas,
        },
        high: {
          maxFee: high.maxFeePerGas,
        },
        displayDecimals: 0, // display btc fees in satoshi
      };
    }

    return null;
  }

  private async getEip1559NetworkFeeRates(
    network: NetworkWithCaipId,
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

  async estimateGasLimit(
    from: string,
    to: string,
    data: string,
    network: NetworkWithCaipId,
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
