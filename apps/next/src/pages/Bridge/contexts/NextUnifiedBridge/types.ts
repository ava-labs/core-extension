import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BridgeAsset,
  GasSettings,
} from '@avalabs/bridge-unified';
import { NetworkWithCaipId, UnifiedBridgeState } from '@core/types';

export interface UnifiedBridgeContext {
  estimateTransferGas(
    symbol: string,
    amount: bigint,
    sourceChainId: string | number,
    targetChainId: string | number,
  ): Promise<bigint>;
  getAssetIdentifierOnTargetChain(
    symbol?: string,
    chainId?: string,
  ): string | undefined;
  getFee(
    symbol: string,
    amount: bigint,
    sourceNetworkId: NetworkWithCaipId['caipId'],
    targetNetworkId: NetworkWithCaipId['caipId'],
  ): Promise<bigint>;
  analyzeTx(txInfo: AnalyzeTxParams): AnalyzeTxResult;
  supportsAsset(
    lookupAddressOrSymbol: string,
    sourceNetworkId: NetworkWithCaipId['caipId'],
    targetChainId: string,
  ): boolean;
  transferAsset(
    symbol: string,
    amount: bigint,
    sourceNetworkId: NetworkWithCaipId['caipId'],
    targetChainId: string,
    gasSettings?: GasSettings,
  ): Promise<string>;
  getMinimumTransferAmount(
    asset: BridgeAsset,
    amount: bigint,
    sourceNetworkId: NetworkWithCaipId['caipId'],
    targetChainId: string,
  ): Promise<bigint>;
  getTransferableAssets(
    sourceNetworkId: NetworkWithCaipId['caipId'],
  ): BridgeAsset[];
  state: UnifiedBridgeState;
  availableChainIds: NetworkWithCaipId['caipId'][];
  isReady: boolean;
}
