import Big from 'big.js';
import {
  AssetType,
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  useHasEnoughForGas,
  useMaxTransferAmount,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useCallback, useMemo, useState } from 'react';
import { useAssetBalanceEVM } from './useAssetBalanceEVM';
import { useAssetBalancesEVM } from './useAssetBalancesEVM';
import { BridgeAdapter } from './useBridge';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import {
  ETHEREUM_NETWORK,
  ETHEREUM_TEST_NETWORK_RINKEBY,
} from '@avalabs/chains-sdk';
import { addGlacierAPIKeyIfNeeded } from '@src/utils/addGlacierAPIKeyIfNeeded';

/**
 * Hook for when the bridge source chain is Ethereum
 */
export function useEthBridge(amount: Big, bridgeFee: Big): BridgeAdapter {
  const {
    currentAsset,
    currentAssetData,
    setTransactionDetails,
    currentBlockchain,
  } = useBridgeSDK();

  const isEthereumBridge = currentBlockchain === Blockchain.ETHEREUM;

  const { createBridgeTransaction, transferAsset } = useBridgeContext();
  const sourceBalance = useAssetBalanceEVM(
    isEthereumBridge ? currentAssetData : undefined,
    Blockchain.ETHEREUM
  );
  const { assetsWithBalances, loading } = useAssetBalancesEVM(
    Blockchain.ETHEREUM
  );

  const { activeAccount } = useAccountsContext();
  const { network } = useNetworkContext();

  const ethereumProvider = useMemo(() => {
    const ethNetwork = network?.isTestnet
      ? ETHEREUM_TEST_NETWORK_RINKEBY
      : ETHEREUM_NETWORK;
    return new JsonRpcBatchInternal(
      {
        maxCalls: 40,
        multiContractAddress: ethNetwork.utilityAddresses?.multicall,
      },
      addGlacierAPIKeyIfNeeded(ethNetwork.rpcUrl),
      ethNetwork.chainId
    );
  }, [network]);
  const hasEnoughForNetworkFee = useHasEnoughForGas(
    isEthereumBridge ? activeAccount?.addressC : undefined,
    ethereumProvider
  );

  const [wrapStatus, setWrapStatus] = useState<WrapStatus>(WrapStatus.INITIAL);
  const [txHash, setTxHash] = useState<string>();

  const maximum =
    useMaxTransferAmount(
      sourceBalance?.balance,
      activeAccount?.addressC,
      ethereumProvider
    ) || undefined;
  const minimum = bridgeFee?.mul(3);
  const receiveAmount = amount.gt(minimum) ? amount.minus(bridgeFee) : BIG_ZERO;

  const transfer = useCallback(async () => {
    if (!currentAssetData) return Promise.reject();

    const timestamp = Date.now();
    const symbol =
      currentAssetData.assetType === AssetType.NATIVE
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
    loading,
    receiveAmount,
    maximum,
    minimum,
    price: sourceBalance?.price,
    wrapStatus,
    txHash,
    transfer,
  };
}
