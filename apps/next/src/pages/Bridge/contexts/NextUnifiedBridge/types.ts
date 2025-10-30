import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BridgeAsset,
  GasSettings,
  ErrorCode as UnifiedBridgeErrorCode,
} from '@avalabs/bridge-unified';
import { NetworkWithCaipId, UnifiedBridgeState } from '@core/types';

export interface UnifiedBridgeContext {
  estimateTransferGas(
    symbol: string,
    amount: bigint,
    sourceNetworkId: NetworkWithCaipId['caipId'],
    targetChainId: string,
  ): Promise<bigint>;
  getAssetIdentifierOnTargetChain(
    symbol?: string,
    chainId?: string,
  ): string | undefined;
  getFee(
    symbol: string,
    amount: bigint,
    sourceNetworkId: NetworkWithCaipId['caipId'],
    targetChainId: string,
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
  ): Promise<any>;
  getErrorMessage(errorCode: UnifiedBridgeErrorCode): string;
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
  isTxConfirming: (txHash: string) => boolean;
}
