import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BridgeAsset,
  GasSettings,
} from '@avalabs/bridge-unified';
import { NetworkWithCaipId, UnifiedBridgeState } from '@core/types';

type NetworkId = NetworkWithCaipId['caipId' | 'chainId'];

export interface UnifiedBridgeContext {
  estimateTransferGas(
    symbol: string,
    amount: bigint,
    sourceChainId: NetworkId,
    targetChainId: NetworkId,
  ): Promise<bigint>;
  getFee(
    symbol: string,
    amount: bigint,
    sourceNetworkId: NetworkId,
    targetNetworkId: NetworkId,
  ): Promise<bigint>;
  analyzeTx(txInfo: AnalyzeTxParams): AnalyzeTxResult;
  supportsAsset(
    lookupAddressOrSymbol: string,
    sourceNetworkId: NetworkId,
    targetNetworkId?: NetworkId,
  ): boolean;
  transferAsset(
    symbol: string,
    amount: bigint,
    sourceNetworkId: NetworkId,
    targetNetworkId: NetworkId,
    gasSettings?: GasSettings,
  ): Promise<string>;
  getMinimumTransferAmount(
    asset: BridgeAsset,
    amount: bigint,
    sourceNetworkId: NetworkId,
    targetNetworkId: NetworkId,
  ): Promise<bigint>;
  getTransferableAssets(networkId: NetworkWithCaipId['caipId']): BridgeAsset[];
  state: UnifiedBridgeState;
  availableChainIds: NetworkWithCaipId['caipId'][];
  isReady: boolean;
}
