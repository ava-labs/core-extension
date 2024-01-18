import Big from 'big.js';
import {
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  useBridgeFeeEstimate,
  WrapStatus,
  useMinimumTransferAmount,
} from '@avalabs/bridge-sdk';
import { useMemo, useState } from 'react';

import { AssetBalance } from '../models';
import { useBtcBridge } from './useBtcBridge';
import { useEthBridge } from './useEthBridge';
import { useAvalancheBridge } from './useAvalancheBridge';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { useUnifiedBridge } from './useUnifiedBridge';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { ChainId } from '@avalabs/chains-sdk';
import { BridgeStepDetails } from '@avalabs/bridge-unified';

export interface BridgeAdapter {
  address?: string;
  sourceBalance?: AssetBalance;
  targetBalance?: AssetBalance;
  assetsWithBalances?: AssetBalance[];
  hasEnoughForNetworkFee: boolean;
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
  transfer: () => Promise<string | undefined>;
  bridgeStep?: BridgeStepDetails;
}

interface Bridge extends BridgeAdapter {
  amount: Big;
  setAmount: (amount: Big) => void;
  bridgeFee?: Big;
  provider: BridgeProviders;
}

export enum BridgeProviders {
  Avalanche,
  Unified,
}

export function useBridge(currentAssetAddress?: string): Bridge {
  const { currentBlockchain: source, targetBlockchain } = useBridgeSDK();
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

  const btc = useBtcBridge(amount);
  const eth = useEthBridge(amount, bridgeFee, minimum);
  const avalanche = useAvalancheBridge(amount, bridgeFee, minimum);
  const unified = useUnifiedBridge(amount, targetChainId, currentAssetAddress);

  const defaults = useMemo(
    () => ({
      amount,
      minimum,
      setAmount,
      bridgeFee,
      provider: BridgeProviders.Avalanche,
    }),
    [amount, bridgeFee, minimum]
  );

  const bridge = useMemo(() => {
    if (
      currentAssetAddress &&
      supportsAsset(currentAssetAddress, targetChainId)
    ) {
      return {
        ...defaults,
        ...unified,
        provider: BridgeProviders.Unified,
      };
    } else if (source === Blockchain.BITCOIN) {
      return {
        ...defaults,
        ...btc,
      };
    } else if (source === Blockchain.ETHEREUM) {
      return {
        ...defaults,
        ...eth,
      };
    } else if (source === Blockchain.AVALANCHE) {
      return {
        ...defaults,
        ...avalanche,
      };
    } else {
      return {
        ...defaults,
        hasEnoughForNetworkFee: true,
        transfer: () => Promise.reject('invalid bridge'),
      };
    }
  }, [
    avalanche,
    btc,
    defaults,
    eth,
    unified,
    source,
    currentAssetAddress,
    supportsAsset,
    targetChainId,
  ]);

  return bridge;
}
