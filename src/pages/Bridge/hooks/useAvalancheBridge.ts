import { BIG_ZERO, Blockchain, useBridgeSDK } from '@avalabs/bridge-sdk';
import { BridgeAdapter } from './useBridge';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { useCallback, useState } from 'react';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import Big from 'big.js';
import { useHasEnoughForGas } from './useHasEnoughtForGas';
import { CustomGasSettings } from '@src/background/services/bridge/models';

/**
 * Hook for when the source is Avalanche
 */
export function useAvalancheBridge(
  amount: Big,
  bridgeFee: Big,
  minimum: Big
): BridgeAdapter {
  const {
    targetBlockchain,
    currentBlockchain,
    setTransactionDetails,
    currentAssetData,
  } = useBridgeSDK();

  const { createBridgeTransaction, transferAsset } = useBridgeContext();

  const isAvalancheBridge = currentBlockchain === Blockchain.AVALANCHE;
  const [txHash, setTxHash] = useState<string>();

  const { assetsWithBalances: selectedAssetWithBalances } = useAssetBalancesEVM(
    Blockchain.AVALANCHE,
    isAvalancheBridge ? currentAssetData : undefined
  );
  const sourceBalance = selectedAssetWithBalances[0];

  const { assetsWithBalances } = useAssetBalancesEVM(Blockchain.AVALANCHE);
  const hasEnoughForNetworkFee = useHasEnoughForGas();

  const maximum = sourceBalance?.balance || BIG_ZERO;
  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;

  const transfer = useCallback(
    async (customGasSettings: CustomGasSettings) => {
      if (!currentAssetData) return Promise.reject();

      const timestamp = Date.now();
      const result = await transferAsset(
        amount,
        currentAssetData,
        customGasSettings,
        () => {
          //not used
        },
        setTxHash
      );

      setTransactionDetails({
        tokenSymbol: currentAssetData.symbol,
        amount,
      });

      createBridgeTransaction({
        sourceChain: Blockchain.AVALANCHE,
        sourceTxHash: result.hash,
        sourceStartedAt: timestamp,
        targetChain: targetBlockchain,
        amount,
        symbol: currentAssetData.symbol,
      });

      return result.hash;
    },
    [
      amount,
      createBridgeTransaction,
      currentAssetData,
      setTransactionDetails,
      targetBlockchain,
      transferAsset,
    ]
  );

  return {
    sourceBalance,
    assetsWithBalances,
    hasEnoughForNetworkFee,
    receiveAmount,
    maximum,
    price: sourceBalance?.price,
    txHash,
    transfer,
  };
}
