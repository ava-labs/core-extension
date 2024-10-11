import Big from 'big.js';
import {
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  useBridgeFeeEstimate,
  WrapStatus,
  useMinimumTransferAmount,
  Asset,
} from '@avalabs/core-bridge-sdk';
import { useMemo, useState } from 'react';

import { AssetBalance } from '../models';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { ChainId } from '@avalabs/core-chains-sdk';
import { BridgeStepDetails } from '@avalabs/bridge-unified';
import { chainIdToCaip } from '@src/utils/caipConversion';

export interface BridgeAdapter {
  address?: string;
  sourceBalance?: AssetBalance;
  targetBalance?: AssetBalance;
  assetsWithBalances?: AssetBalance[];
  loading?: boolean;
  networkFee?: Big;
  bridgeFee?: Big;
  /** Amount minus network and bridge fees */
  receiveAmount?: Big;
  /** Maximum transfer amount */
  maximum?: Big;
  /** Minimum transfer amount */
  minimum?: Big;
  /** Price for the current asset & currency code */
  price?: number;
  wrapStatus?: WrapStatus;
  txHash?: string;
  /**
   * Transfer funds to the target blockchain
   * @returns the transaction hash
   */
  transfer: () => Promise<string>;
  estimateGas(amount: Big, asset?: Asset): Promise<bigint | undefined>;
  bridgeStep?: BridgeStepDetails;
}

interface Bridge {
  amount: Big;
  setAmount: (amount: Big) => void;
  bridgeFee: Big;
  provider: BridgeProviders;
  minimum: Big;
  targetChainId: string;
}

export enum BridgeProviders {
  Avalanche,
  Unified,
}

export function useBridge(currentAssetIdentifier?: string): Bridge {
  const { targetBlockchain } = useBridgeSDK();
  const { supportsAsset } = useUnifiedBridgeContext();

  const [amount, setAmount] = useState<Big>(BIG_ZERO);

  const bridgeFee = useBridgeFeeEstimate(amount) || BIG_ZERO;
  const minimum = useMinimumTransferAmount(amount);
  const { isDeveloperMode } = useNetworkContext();

  const targetChainId = useMemo(() => {
    switch (targetBlockchain) {
      case Blockchain.ETHEREUM:
        return isDeveloperMode
          ? ChainId.ETHEREUM_TEST_SEPOLIA
          : ChainId.ETHEREUM_HOMESTEAD;

      case Blockchain.AVALANCHE:
        return isDeveloperMode
          ? ChainId.AVALANCHE_TESTNET_ID
          : ChainId.AVALANCHE_MAINNET_ID;

      case Blockchain.BITCOIN:
        return isDeveloperMode ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN;

      default:
        // NOTE: this will only happen for Ethereum and is safe for now,
        // since we're only using this piece of code for Unified Bridge (CCTP).
        // Needs revisiting when we migrate Avalanche Bridge to @avalabs/bridge-unified package.
        return isDeveloperMode
          ? ChainId.ETHEREUM_TEST_SEPOLIA
          : ChainId.ETHEREUM_HOMESTEAD;
    }
  }, [isDeveloperMode, targetBlockchain]);

  return {
    amount,
    setAmount,
    minimum,
    bridgeFee,
    targetChainId: chainIdToCaip(targetChainId),
    provider:
      currentAssetIdentifier &&
      supportsAsset(currentAssetIdentifier, chainIdToCaip(targetChainId))
        ? BridgeProviders.Unified
        : BridgeProviders.Avalanche,
  };
}
