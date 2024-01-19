import Big from 'big.js';
import {
  BIG_ZERO,
  Blockchain,
  isNativeAsset,
  useBridgeSDK,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useCallback, useEffect, useState } from 'react';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { BridgeAdapter } from './useBridge';
import { useHasEnoughForGas } from './useHasEnoughtForGas';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetEthMaxTransferAmountHandler } from '@src/background/services/bridge/handlers/getEthMaxTransferAmount';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

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
    setTransactionDetails,
    currentBlockchain,
  } = useBridgeSDK();
  const [maximum, setMaximum] = useState<Big | undefined>(undefined);
  const { request } = useConnectionContext();
  const isEthereumBridge = currentBlockchain === Blockchain.ETHEREUM;

  useEffect(() => {
    if (!currentAsset || !isEthereumBridge) return;

    // calculating the max amount for eth can take a couple seconds
    // make sure we don't have a stale value
    setMaximum(undefined);

    const getMax = async () => {
      const maxAmount = await request<GetEthMaxTransferAmountHandler>({
        method: ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
        params: [currentAsset],
      });
      setMaximum(maxAmount || undefined);
    };
    getMax();
  }, [request, currentAsset, isEthereumBridge]);

  const { createBridgeTransaction, transferAsset } = useBridgeContext();
  const { assetsWithBalances } = useAssetBalancesEVM(Blockchain.ETHEREUM);
  const sourceBalance = assetsWithBalances.find(
    ({ asset }) => asset.symbol === currentAsset
  );

  const hasEnoughForNetworkFee = useHasEnoughForGas();

  const [wrapStatus, setWrapStatus] = useState<WrapStatus>(WrapStatus.INITIAL);
  const [txHash, setTxHash] = useState<string>();

  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;

  const transfer = useCallback(async () => {
    if (!currentAssetData) return Promise.reject();

    const timestamp = Date.now();
    const symbol = isNativeAsset(currentAssetData)
      ? currentAssetData.wrappedAssetSymbol
      : currentAsset || '';

    const result = await transferAsset(
      amount,
      currentAssetData,
      setWrapStatus,
      setTxHash
    );

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
    transferAsset,
  ]);

  return {
    sourceBalance,
    assetsWithBalances,
    hasEnoughForNetworkFee,
    receiveAmount,
    maximum,
    price: sourceBalance?.price,
    wrapStatus,
    txHash,
    transfer,
  };
}
