import { BIG_ZERO, Blockchain, useBridgeSDK } from '@avalabs/core-bridge-sdk';
import { BridgeAdapter } from './useBridge';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { useCallback } from 'react';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import Big from 'big.js';

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

  const { createBridgeTransaction, transferEVMAsset, estimateGas } =
    useBridgeContext();

  const isAvalancheBridge = currentBlockchain === Blockchain.AVALANCHE;

  const { assetsWithBalances: selectedAssetWithBalances } = useAssetBalancesEVM(
    Blockchain.AVALANCHE,
    isAvalancheBridge ? currentAssetData : undefined
  );
  const sourceBalance = selectedAssetWithBalances[0];

  const { assetsWithBalances } = useAssetBalancesEVM(Blockchain.AVALANCHE);

  const maximum = sourceBalance?.balance || BIG_ZERO;
  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;

  const transfer = useCallback(async () => {
    if (!currentAssetData) {
      throw new Error('No asset selected');
    }

    const timestamp = Date.now();
    const result = await transferEVMAsset(amount, currentAssetData);

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
  }, [
    amount,
    createBridgeTransaction,
    currentAssetData,
    setTransactionDetails,
    targetBlockchain,
    transferEVMAsset,
  ]);

  return {
    sourceBalance,
    assetsWithBalances,
    receiveAmount,
    maximum,
    price: sourceBalance?.price,
    estimateGas,
    transfer,
  };
}
