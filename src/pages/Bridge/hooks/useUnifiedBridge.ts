import Big from 'big.js';
import { bigToBigInt } from '@avalabs/core-utils-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Asset,
  BIG_ZERO,
  Blockchain,
  isNativeAsset,
  useBridgeSDK,
} from '@avalabs/core-bridge-sdk';

import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { bigintToBig } from '@src/utils/bigintToBig';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { BridgeAdapter } from './useBridge';
import { isUnifiedBridgeAsset } from '../utils/isUnifiedBridgeAsset';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

/**
 * Hook for when the Unified Bridge SDK can handle the transfer
 */
export function useUnifiedBridge(
  amount: Big,
  targetChainId: string,
  currentAssetIdentifier?: string
): BridgeAdapter {
  const {
    currentAsset,
    currentAssetData,
    setTransactionDetails,
    currentBlockchain,
    targetBlockchain,
  } = useBridgeSDK();
  const { network } = useNetworkContext();
  const { capture } = useAnalyticsContext();
  const { estimateTransferGas, getFee, transferAsset, supportsAsset } =
    useUnifiedBridgeContext();

  const [receiveAmount, setReceiveAmount] = useState<Big>();
  const [maximum, setMaximum] = useState<Big>();
  const [minimum, setMinimum] = useState<Big>();
  const [bridgeFee, setBridgeFee] = useState<Big>();

  const isEthereum = currentBlockchain === Blockchain.ETHEREUM;
  const { assetsWithBalances } = useAssetBalancesEVM(
    isEthereum ? Blockchain.ETHEREUM : Blockchain.AVALANCHE
  );
  const sourceBalance = useMemo(() => {
    if (!currentAsset || !currentAssetIdentifier || !network) {
      return undefined;
    }

    return assetsWithBalances.find(({ asset }) => {
      return isUnifiedBridgeAsset(asset) && asset.symbol === currentAsset;
    });
  }, [network, assetsWithBalances, currentAssetIdentifier, currentAsset]);

  useEffect(() => {
    if (!maximum && sourceBalance?.balance) {
      setMaximum(sourceBalance.balance);
    }
  }, [maximum, sourceBalance]);

  useEffect(() => {
    let isMounted = true;

    if (
      currentAsset &&
      currentAssetData &&
      currentAssetIdentifier &&
      amount &&
      supportsAsset(currentAssetIdentifier, targetChainId)
    ) {
      const hasAmount = amount && !amount.eq(BIG_ZERO);

      if (hasAmount) {
        getFee(
          currentAsset,
          bigToBigInt(amount, currentAssetData.denomination),
          targetChainId
        ).then((fee) => {
          if (!isMounted) {
            return;
          }

          const feeBig = bigintToBig(fee, currentAssetData.denomination);
          setBridgeFee(feeBig);
          setMinimum(feeBig);
          setReceiveAmount(amount.sub(feeBig));
        });
      }

      if (sourceBalance?.balance) {
        setMaximum(sourceBalance.balance);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    currentAsset,
    currentAssetData,
    currentAssetIdentifier,
    amount,
    targetChainId,
    getFee,
    sourceBalance?.balance,
    supportsAsset,
  ]);

  const estimateGas = useCallback(
    (transferAmount: Big, asset: Asset) => {
      if (!asset) {
        throw new Error('No asset data');
      }

      const symbol = isNativeAsset(asset)
        ? asset.wrappedAssetSymbol
        : asset.symbol;

      return estimateTransferGas(
        symbol,
        bigToBigInt(transferAmount, asset.denomination),
        targetChainId
      );
    },
    [estimateTransferGas, targetChainId]
  );

  const transfer = useCallback(async () => {
    capture('unifedBridgeTransferStarted', {
      bridgeType: 'CCTP',
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
    });

    if (!currentAsset) {
      throw new Error('No asset chosen');
    }

    if (!currentAssetData) {
      throw new Error('No asset data');
    }

    const symbol = isNativeAsset(currentAssetData)
      ? currentAssetData.wrappedAssetSymbol
      : currentAsset || '';

    const hash = await transferAsset(
      currentAsset,
      bigToBigInt(amount, currentAssetData.denomination),
      targetChainId
    );

    setTransactionDetails({
      tokenSymbol: symbol,
      amount,
    });

    return hash;
  }, [
    amount,
    currentAssetData,
    currentAsset,
    setTransactionDetails,
    transferAsset,
    targetChainId,
    capture,
    currentBlockchain,
    targetBlockchain,
  ]);

  return {
    sourceBalance,
    estimateGas,
    assetsWithBalances,
    receiveAmount,
    bridgeFee,
    maximum,
    minimum,
    price: sourceBalance?.price,
    transfer,
  };
}
