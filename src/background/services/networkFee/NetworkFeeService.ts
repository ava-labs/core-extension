import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { singleton } from 'tsyringe';
import { NetworkFee } from './models';
import { NetworkWithCaipId } from '../network/models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';

@singleton()
export class NetworkFeeService {
  constructor(private moduleManager: ModuleManager) {}

  async getNetworkFee(network: NetworkWithCaipId): Promise<NetworkFee | null> {
    const module = await this.moduleManager.loadModuleByNetwork(network);
    if (network.vmName === NetworkVMType.EVM) {
      const fees = await module.getNetworkFee(network);
      return { ...fees, displayDecimals: fees.displayDecimals || 9 };
    } else if (network.vmName === NetworkVMType.BITCOIN) {
      const { low, medium, high, isFixedFee } = await module.getNetworkFee(
        network
      );

      return {
        isFixedFee,
        low: {
          maxFeePerGas: low.maxFeePerGas,
        },
        medium: {
          maxFeePerGas: medium.maxFeePerGas,
        },
        high: {
          maxFeePerGas: high.maxFeePerGas,
        },
        displayDecimals: 0, // display btc fees in satoshi
      };
    }

    return null;
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
