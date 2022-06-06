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
import { BitcoinInputUTXO, getMaxTransferAmount } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useBridgeContext } from '@src/contexts/BridgeProvider';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useInterval } from '@src/hooks/useInterval';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AssetBalance, BALANCE_REFRESH_INTERVAL } from './models';
import { BridgeAdapter } from './useBridge';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { NetworkFee } from '@src/background/services/networkFee/models';

/**
 * Hook for Bitcoin to Avalanche transactions
 */
export function useBtcBridge(amountInBtc: Big): BridgeAdapter {
  const {
    currentAsset,
    setTransactionDetails,
    currentBlockchain,
    targetBlockchain,
  } = useBridgeSDK();
  const isBitcoinBridge =
    currentBlockchain === Blockchain.BITCOIN ||
    targetBlockchain === Blockchain.BITCOIN;

  const refetchInterval = useInterval(BALANCE_REFRESH_INTERVAL);
  const { request } = useConnectionContext();
  const { isDeveloperMode } = useNetworkContext();
  const { getNetworkFeeForNetwork } = useNetworkFeeContext();
  const { config } = useBridgeConfig();
  const { createBridgeTransaction } = useBridgeContext();
  const { balances } = useBalancesContext();
  const { activeAccount } = useAccountsContext();

  const [btcBalance, setBtcBalance] = useState<AssetBalance>();
  const [btcBalanceAvalanche, setBtcBalanceAvalanche] =
    useState<AssetBalance>();
  const [utxos, setUtxos] = useState<BitcoinInputUTXO[]>();
  const [feeRates, setFeeRates] = useState<NetworkFee | null>();

  const feeRate = useMemo(() => {
    return feeRates?.high.toNumber() || 0;
  }, [feeRates]);

  const maximum = useMemo(() => {
    if (!config || !activeAccount) return Big(0);
    const maxAmt = getMaxTransferAmount(
      utxos || [],
      // As long as the address type is the same (P2WPKH) it should not matter.
      config.criticalBitcoin.walletAddresses.btc,
      activeAccount.addressBTC,
      feeRate
    );
    return satoshiToBtc(maxAmt);
  }, [utxos, config, feeRate, activeAccount]);

  /** Network fee (in BTC) */
  const [networkFee, setNetworkFee] = useState<Big>();
  /** Amount minus network and bridge fees (in BTC) */
  const [receiveAmount, setReceiveAmount] = useState<Big>();
  /** Minimum transfer amount (in BTC) */
  const [minimum, setMinimum] = useState<Big>();

  const loading = !btcBalance || !btcBalanceAvalanche || !networkFee;
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

  useEffect(() => {
    async function loadFeeRates() {
      if (isBitcoinBridge && refetchInterval) {
        const rates = await getNetworkFeeForNetwork(
          isDeveloperMode ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN
        );
        setFeeRates(rates);
      }
    }

    loadFeeRates();
  }, [
    getNetworkFeeForNetwork,
    isBitcoinBridge,
    isDeveloperMode,
    refetchInterval,
  ]);

  // balances, utxos
  useEffect(() => {
    if (isBitcoinBridge && btcAsset && activeAccount && refetchInterval) {
      const btcBalance =
        balances[isDeveloperMode ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN]?.[
          activeAccount.addressBTC
        ][0];

      if (btcBalance) {
        setUtxos(btcBalance.utxos);
        setBtcBalance({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcBalance.balance.toNumber()),
        });
      }

      const btcAvalabcheBalance = balances[
        isDeveloperMode
          ? ChainId.AVALANCHE_TESTNET_ID
          : ChainId.AVALANCHE_MAINNET_ID
      ]?.[activeAccount.addressC].find((token) => token.symbol === 'BTC.b');

      if (btcAvalabcheBalance) {
        setBtcBalanceAvalanche({
          symbol: btcAsset.symbol,
          asset: btcAsset,
          balance: satoshiToBtc(btcAvalabcheBalance?.balance.toNumber() || 0),
        });
      }
    }
  }, [
    activeAccount,
    balances,
    btcAsset,
    isBitcoinBridge,
    isDeveloperMode,
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
        feeRate
      );

      setNetworkFee(satoshiToBtc(fee));
      setReceiveAmount(satoshiToBtc(receiveAmount));
    } catch (error) {
      const errMessage = (error as any)?.toString();
      if (!errMessage.includes('Amount must be at least')) console.error(error);
      // getBtcTransaction throws an error when the amount is too low
      // so set these to 0
      setNetworkFee(BIG_ZERO);
      setReceiveAmount(BIG_ZERO);
    }

    const minimumSatoshis = getMinimumTransferAmount(
      Blockchain.BITCOIN,
      config,
      amountInSatoshis
    );
    setMinimum(satoshiToBtc(minimumSatoshis));
  }, [
    amountInSatoshis,
    activeAccount,
    config,
    isBitcoinBridge,
    utxos,
    feeRate,
  ]);

  const transfer = useCallback(async () => {
    if (!isBitcoinBridge || !config || !activeAccount || !btcAsset || !utxos)
      return;

    const timestamp = Date.now();
    const symbol = currentAsset || '';

    const result = await request({
      method: ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC,
      params: [amountInSatoshis, feeRate],
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
    feeRate,
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
    maximum,
    minimum,
    transfer,
  };
}
