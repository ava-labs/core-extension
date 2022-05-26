import {
  BIG_ZERO,
  Blockchain,
  btcToSatoshi,
  getBtcAsset,
  getBtcTransaction,
  getMinimumTransferAmount,
  satoshiToBtc,
  useBridgeConfig,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { BitcoinInputUTXO } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useInterval } from '@src/hooks/useInterval';
import Big from 'big.js';
import { useCallback, useEffect, useState } from 'react';
import { AssetBalance, BALANCE_REFRESH_INTERVAL } from './models';
import { BridgeAdapter } from './useBridge';

/**
 * Hook for Bitcoin to Avalanche transactions
 */
export function useBtcBridge(amountInBtc: Big): BridgeAdapter {
  const { currentAsset, setTransactionDetails, currentBlockchain } =
    useBridgeSDK();
  const isBitcoinBridge = currentBlockchain === Blockchain.BITCOIN;

  const refetchInterval = useInterval(BALANCE_REFRESH_INTERVAL);
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
  const { config } = useBridgeConfig();
  const { createBridgeTransaction } = useBridgeContext();
  const { balances } = useBalancesContext();
  const { activeAccount } = useAccountsContext();

  const [loading, setLoading] = useState(false);
  const [btcBalance, setBtcBalance] = useState<AssetBalance>();
  const [btcBalanceAvalanche, setBtcBalanceAvalanche] =
    useState<AssetBalance>();
  const [utxos, setUtxos] = useState<BitcoinInputUTXO[]>();

  /** Network fee (in BTC) */
  const [networkFee, setFee] = useState<Big>();
  /** Amount minus network and bridge fees (in BTC) */
  const [receiveAmount, setReceiveAmount] = useState<Big>();
  /** Minimum transfer amount (in BTC) */
  const [minimum, setMinimum] = useState<Big>();

  const amountInSatoshis = btcToSatoshi(amountInBtc);

  const btcAsset = config && getBtcAsset(config);
  const assetsWithBalances = btcAsset
    ? [
        {
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: btcBalance?.balance,
        },
      ]
    : [];

  // balances, utxos
  useEffect(() => {
    async function load() {
      if (isBitcoinBridge && btcAsset && activeAccount) {
        setLoading(true);
        const btcBalance =
          balances[
            network?.isTestnet ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN
          ]?.[activeAccount.addressBTC][0];
        const btcAvalabcheBalance = balances[
          network?.isTestnet
            ? ChainId.AVALANCHE_TESTNET_ID
            : ChainId.AVALANCHE_MAINNET_ID
        ][activeAccount.addressC].find((token) => token.symbol === 'BTC.b');
        setUtxos(btcBalance.utxos);
        setBtcBalance({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcBalance.balance.toNumber()),
        });
        setBtcBalanceAvalanche({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcAvalabcheBalance?.balance.toNumber() || 0),
        });
        setLoading(false);
      }
    }

    load();
  }, [
    activeAccount,
    balances,
    btcAsset,
    isBitcoinBridge,
    network,
    refetchInterval,
    request,
  ]);

  useEffect(() => {
    if (!isBitcoinBridge || !config || !activeAccount || !utxos) return;

    try {
      const { fee, receiveAmount } = getBtcTransaction(
        config,
        activeAccount.addressBTC,
        utxos,
        amountInSatoshis,
        networkFee?.toNumber() || 0
      );

      setFee(satoshiToBtc(fee));
      setReceiveAmount(satoshiToBtc(receiveAmount));
    } catch {
      // getBtcTransaction throws an error when the amount is too low
      // so set these to 0
      setFee(BIG_ZERO);
      setReceiveAmount(BIG_ZERO);
    }

    const minimumSatoshis = getMinimumTransferAmount(
      Blockchain.BITCOIN,
      config,
      amountInSatoshis
    );
    setMinimum(satoshiToBtc(minimumSatoshis));
  }, [amountInSatoshis, activeAccount, config, isBitcoinBridge, utxos]);

  const transfer = useCallback(async () => {
    if (!isBitcoinBridge || !config || !activeAccount || !btcAsset || !utxos)
      return;

    const timestamp = Date.now();
    const symbol = currentAsset || '';

    const result = await request({
      method: ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC,
      params: [amountInSatoshis],
    });

    setTransactionDetails({
      tokenSymbol: symbol,
      amount: amountInBtc,
    });
    createBridgeTransaction({
      sourceChain: Blockchain.BITCOIN,
      sourceTxHash: result.hash,
      sourceStartedAt: timestamp,
      targetChain: Blockchain.AVALANCHE,
      amount: amountInBtc,
      symbol,
    });

    return result.hash;
  }, [
    activeAccount,
    amountInBtc,
    amountInSatoshis,
    btcAsset,
    config,
    createBridgeTransaction,
    currentAsset,
    isBitcoinBridge,
    request,
    setTransactionDetails,
    utxos,
  ]);

  return {
    address: activeAccount?.addressBTC,
    sourceBalance: btcBalance,
    targetBalance: btcBalanceAvalanche,
    assetsWithBalances,
    hasEnoughForNetworkFee: true, // minimum calc covers this
    loading,
    networkFee,
    receiveAmount,
    maximum: btcBalance?.balance,
    minimum,
    transfer,
  };
}
