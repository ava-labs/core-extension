import { Big } from '@avalabs/avalanche-wallet-sdk';
import {
  AssetType,
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  useBridgeFeeEstimate,
  usePrice,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useState } from 'react';
import { AssetBalance } from './models';
import { useBtcBridge } from './useBtcBridge';
import { useEthBridge } from './useEthBridge';
import { useAvalancheBridge } from './useAvalancheBridge';
import { VsCurrencyType } from '@avalabs/coingecko-sdk';

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
  /** Price for the current asset & currency code */
  price?: Big;
}

export function useBridge(): Bridge {
  const {
    currentBlockchain: source,
    currentAsset,
    currentAssetData,
  } = useBridgeSDK();
  const [amount, setAmount] = useState<Big>(BIG_ZERO);
  const { currency } = useSettingsContext();

  const price = usePrice(
    currentAssetData?.assetType === AssetType.BTC ? 'bitcoin' : currentAsset,
    currency.toLowerCase() as VsCurrencyType
  );

  const bridgeFee = useBridgeFeeEstimate(amount) || BIG_ZERO;

  const btc = useBtcBridge(amount);
  const eth = useEthBridge(amount, bridgeFee);
  const avalanche = useAvalancheBridge(amount, bridgeFee);

  const defaults = {
    amount,
    setAmount,
    bridgeFee,
    price,
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
