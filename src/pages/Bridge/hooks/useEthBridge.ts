import Big from 'big.js';
import {
  BIG_ZERO,
  Blockchain,
  getAssets,
  getMaxTransferAmount,
  isNativeAsset,
  useBridgeSDK,
} from '@avalabs/core-bridge-sdk';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useCallback, useEffect, useState } from 'react';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { BridgeAdapter } from './useBridge';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

/**
 * Hook for when the bridge source chain is Ethereum
 */
export function useEthBridge(
  amount: Big,
  bridgeFee: Big,
  minimum: Big
): BridgeAdapter {
  const {
    currentAsset,
    currentAssetData,
    bridgeConfig,
    setTransactionDetails,
    currentBlockchain,
  } = useBridgeSDK();
  const [maximum, setMaximum] = useState<Big | undefined>(undefined);
  const isEthereumBridge = currentBlockchain === Blockchain.ETHEREUM;

  const { createBridgeTransaction, transferEVMAsset, estimateGas } =
    useBridgeContext();
  const { assetsWithBalances } = useAssetBalancesEVM(Blockchain.ETHEREUM);
  const { ethereumProvider } = useNetworkContext();
  const sourceBalance = assetsWithBalances.find(
    ({ asset }) => asset.symbol === currentAsset
  );

  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;
  const sourceBalanceAsString = sourceBalance?.balance?.toString();

  useEffect(() => {
    if (
      !currentAsset ||
      !isEthereumBridge ||
      !bridgeConfig.config ||
      !sourceBalanceAsString ||
      !ethereumProvider
    ) {
      return;
    }

    const ethereumAssets = getAssets(currentBlockchain, bridgeConfig.config);
    let isMounted = true;

    // Estimating gas can take a couple seconds - reset it before calculating
    // so we don't use a stale value.
    setMaximum(undefined);

    getMaxTransferAmount({
      currentBlockchain,
      balance: new Big(sourceBalanceAsString),
      currentAsset,
      assets: ethereumAssets,
      provider: ethereumProvider,
      config: bridgeConfig.config,
    }).then((max) => {
      if (!isMounted) {
        return;
      }

      setMaximum(max ?? undefined);
    });

    return () => {
      isMounted = false;
    };
  }, [
    bridgeConfig?.config,
    currentAsset,
    currentBlockchain,
    ethereumProvider,
    isEthereumBridge,
    sourceBalanceAsString,
  ]);

  const transfer = useCallback(async () => {
    if (!currentAssetData) {
      throw new Error('No asset selected');
    }

    const timestamp = Date.now();

    const symbol = isNativeAsset(currentAssetData)
      ? currentAssetData.wrappedAssetSymbol
      : currentAsset || '';

    const result = await transferEVMAsset(amount, currentAssetData);

    setTransactionDetails({
      tokenSymbol: symbol,
      amount,
    });
    createBridgeTransaction({
      sourceChain: Blockchain.ETHEREUM,
      sourceTxHash: result.hash,
      sourceStartedAt: timestamp,
      targetChain: Blockchain.AVALANCHE,
      amount,
      symbol,
    });

    return result.hash;
  }, [
    amount,
    currentAssetData,
    createBridgeTransaction,
    currentAsset,
    setTransactionDetails,
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
