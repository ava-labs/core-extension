import {
  GetBalancesResponse,
  GetTransactionHistory,
  Manifest,
  Module,
  Network,
  NetworkContractToken,
  NetworkFees,
  RpcRequest,
  RpcResponse,
  parseManifest,
} from '@avalabs/vm-module-types';
import { ethErrors } from 'eth-rpc-errors';

import manifest from './pvm.manifest.json';

export class PVMModule implements Module {
  getManifest(): Manifest | undefined {
    const result = parseManifest(manifest);
    return result.success ? result.data : undefined;
  }

  getBalances(): Promise<GetBalancesResponse> {
    return Promise.resolve({});
  }

  getTransactionHistory(
    _: GetTransactionHistory // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    return Promise.resolve({ transactions: [], nextPageToken: '' });
  }

  getNetworkFee(): Promise<NetworkFees> {
    return Promise.resolve({
      low: { maxPriorityFeePerGas: 0n, maxFeePerGas: 0n },
      medium: { maxPriorityFeePerGas: 0n, maxFeePerGas: 0n },
      high: { maxPriorityFeePerGas: 0n, maxFeePerGas: 0n },
      baseFee: 0n,
      isFixedFee: false,
    });
  }

  getAddress() {
    return Promise.resolve('PVM address');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTokens(_: Network): Promise<NetworkContractToken[]> {
    return Promise.resolve([]);
  }

  async onRpcRequest(request: RpcRequest): Promise<RpcResponse> {
    return {
      error: ethErrors.rpc.methodNotSupported({
        data: `Method ${request.method} not supported`,
      }) as any, // TODO: fix it
    };
  }
}
