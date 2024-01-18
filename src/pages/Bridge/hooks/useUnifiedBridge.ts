import Big from 'big.js';
import { bigToBigInt } from '@avalabs/utils-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Blockchain, isNativeAsset, useBridgeSDK } from '@avalabs/bridge-sdk';

import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { bigintToBig } from '@src/utils/bigintToBig';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { BridgeAdapter } from './useBridge';
import { useHasEnoughForGas } from './useHasEnoughtForGas';
import { isUnifiedBridgeAsset } from '../utils/isUnifiedBridgeAsset';
import { BridgeStepDetails } from '@avalabs/bridge-unified';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

/**
 * Hook for when the Unified Bridge SDK can handle the transfer
 */
export function useUnifiedBridge(
  amount: Big,
  targetChainId: number,
  currentAssetAddress?: string
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
  const { getFee, transferAsset, supportsAsset } = useUnifiedBridgeContext();

  const [receiveAmount, setReceiveAmount] = useState<Big>();
  const [maximum, setMaximum] = useState<Big>();
  const [minimum, setMinimum] = useState<Big>();
  const [bridgeFee, setBridgeFee] = useState<Big>();
  const [bridgeStep, setBridgeStep] = useState<BridgeStepDetails>();

  const isEthereum = currentBlockchain === Blockchain.ETHEREUM;
  const { assetsWithBalances } = useAssetBalancesEVM(
    isEthereum ? Blockchain.ETHEREUM : Blockchain.AVALANCHE
  );
  const sourceBalance = useMemo(() => {
    if (!currentAsset || !currentAssetAddress || !network) {
      return undefined;
    }

    return assetsWithBalances.find(({ asset }) => {
      return isUnifiedBridgeAsset(asset) && asset.symbol === currentAsset;
    });
  }, [network, assetsWithBalances, currentAssetAddress, currentAsset]);

  const hasEnoughForNetworkFee = useHasEnoughForGas();

  const [txHash, setTxHash] = useState<string>();

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
      currentAssetAddress &&
      amount &&
      supportsAsset(currentAssetAddress, targetChainId)
    ) {
      getFee(
        currentAsset,
        bigToBigInt(amount, currentAssetData.denomination),
        targetChainId
      ).then((fee) => {
        // Do not update the state if the component was unmounted in the meantime
        if (!isMounted) {
          return;
        }

        const feeBig = bigintToBig(fee, currentAssetData.denomination);
        setBridgeFee(feeBig);
        setMinimum(feeBig);
        setReceiveAmount(amount.sub(feeBig));

        if (sourceBalance?.balance) {
          setMaximum(sourceBalance.balance);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [
    currentAsset,
    currentAssetData,
    currentAssetAddress,
    amount,
    targetChainId,
    getFee,
    sourceBalance,
    supportsAsset,
  ]);

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
      targetChainId,
      setBridgeStep
    );

    setTxHash(hash);
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
    bridgeStep,
    assetsWithBalances,
    hasEnoughForNetworkFee,
    receiveAmount,
    bridgeFee,
    maximum,
    minimum,
    price: sourceBalance?.price,
    txHash,
    transfer,
  };
}
