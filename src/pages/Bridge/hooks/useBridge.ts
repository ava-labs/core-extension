import {
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  useBridgeFeeEstimate,
  WrapStatus,
  useMinimumTransferAmount,
} from '@avalabs/bridge-sdk';
import { useState } from 'react';
import { AssetBalance } from '../models';
import { useBtcBridge } from './useBtcBridge';
import { useEthBridge } from './useEthBridge';
import { useAvalancheBridge } from './useAvalancheBridge';
import Big from 'big.js';

export interface BridgeAdapter {
  address?: string;
  sourceBalance?: AssetBalance;
  targetBalance?: AssetBalance;
  assetsWithBalances?: AssetBalance[];
  hasEnoughForNetworkFee: boolean;
  loading?: boolean;
  networkFee?: Big;
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
}

interface Bridge extends BridgeAdapter {
  amount: Big;
  setAmount: (amount: Big) => void;
  bridgeFee?: Big;
}

export function useBridge(): Bridge {
  const { currentBlockchain: source } = useBridgeSDK();

  const [amount, setAmount] = useState<Big>(BIG_ZERO);

  const bridgeFee = useBridgeFeeEstimate(amount) || BIG_ZERO;
  const minimum = useMinimumTransferAmount(amount);

  const btc = useBtcBridge(amount);
  const eth = useEthBridge(amount, bridgeFee, minimum);
  const avalanche = useAvalancheBridge(amount, bridgeFee, minimum);

  const defaults = {
    amount,
    minimum,
    setAmount,
    bridgeFee,
  };

  if (source === Blockchain.BITCOIN) {
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
}
