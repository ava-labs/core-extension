import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { BridgeService } from '../bridge/BridgeService';
import { BitcoinHistoryTx } from '@avalabs/wallets-sdk';
import { singleton } from 'tsyringe';
import { Erc20Tx } from '@avalabs/snowtrace-sdk';
import { Network } from '@avalabs/chains-sdk';
import { isEthereumNetwork } from '../network/utils/isEthereumNetwork';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';

@singleton()
export class HistoryServiceBridgeHelper {
  constructor(
    private bridgeService: BridgeService,
    private unifiedBridgeService: UnifiedBridgeService
  ) {}

  /**
   * Checking if the transaction is a bridge transaction with Ethereum
   *
   * If the tx is TransactionERC20
   * to or from has to be ETHEREUM_ADDRESS
   * and the contractAddress of the transaction has to match one of the addresses from EthereumConfigAssets
   *
   * If the tx is BitcoinHistoryTx
   * it should be false since we currently do not support bridge between Bitcoin and Ethereum
   */
  isBridgeTransactionEVM(tx: Erc20Tx, network: Network): boolean {
    const config = this.bridgeService.bridgeConfig;
    const ethereumAssets = config?.config?.critical.assets;
    const bitcoinAssets = config?.config?.criticalBitcoin?.bitcoinAssets;
    const unifiedBridgeAddresses = this.unifiedBridgeService.state.addresses;

    if (!ethereumAssets || !bitcoinAssets) {
      return false;
    }

    if (
      unifiedBridgeAddresses.includes(tx.from.toLowerCase()) ||
      unifiedBridgeAddresses.includes(tx.to.toLowerCase())
    ) {
      return true;
    }

    if (isEthereumNetwork(network)) {
      const ethBridgeAddress = config.config?.critical.walletAddresses.ethereum;
      return (
        tx.to.toLowerCase() === ethBridgeAddress ||
        tx.from.toLowerCase() === ethBridgeAddress
      );
    } else {
      return (
        Object.values(ethereumAssets).some(({ wrappedContractAddress }) => {
          return (
            wrappedContractAddress.toLowerCase() ===
              tx.contractAddress.toLowerCase() &&
            (tx.to === ETHEREUM_ADDRESS || tx.from === ETHEREUM_ADDRESS)
          );
        }) ||
        Object.values(bitcoinAssets).some(
          ({ wrappedContractAddress }) =>
            wrappedContractAddress.toLowerCase() ===
            tx.contractAddress.toLowerCase()
        )
      );
    }
  }

  /**
   * Checking if the transaction is a bridge transaction with Bitcoin
   *
   * If the tx is TransactionERC20
   * The contractAddress from the transaction has to match one of the addresses from BitcoinConfigAssets
   *
   * If the tx is BitcoinHistoryTx
   * addresses is an array of addresses to or from.
   * It should include
   * config.criticalBitcoin?.walletAddresses.btc or
   * config.criticalBitcoin?.walletAddresses.avalanche
   */
  isBridgeTransactionBTC(tx: BitcoinHistoryTx): boolean {
    const config = this.bridgeService.bridgeConfig;
    const bitcoinWalletAddresses =
      config?.config?.criticalBitcoin?.walletAddresses;

    if (!bitcoinWalletAddresses) {
      return false;
    }

    return tx.addresses.some((address) => {
      return [
        bitcoinWalletAddresses.btc,
        bitcoinWalletAddresses.avalanche,
      ].some(
        (walletAddress) => address.toLowerCase() === walletAddress.toLowerCase()
      );
    });
  }
}
