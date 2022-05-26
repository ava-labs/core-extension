import {
  getBTCBlockchainLink,
  isBridgeTransaction,
} from '@src/utils/bridgeTransactionUtils';
import { BridgeService } from './../bridge/BridgeService';
import { BitcoinHistoryTx, BlockCypherProvider } from '@avalabs/wallets-sdk';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { WalletService } from '../wallet/WalletService';
import {
  AVAX_TOKEN,
  TransactionERC20,
  TransactionNormal,
} from '@avalabs/wallet-react-components';
import {
  isTransactionBitcoin,
  isTransactionERC20,
  isTransactionNormal,
} from '@src/utils/transactionUtils';
import { TxHistoryItem } from './models';
import { BITCOIN_NETWORK, Network, NetworkVMType } from '@avalabs/chains-sdk';

@singleton()
export class HistoryService {
  constructor(
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private walletService: WalletService,
    private bridgeService: BridgeService
  ) {}
  isBridge(tx: TransactionNormal | TransactionERC20 | BitcoinHistoryTx) {
    try {
      const config = this.bridgeService.bridgeConfig;
      const bitcoinAssets = config?.config?.criticalBitcoin?.bitcoinAssets;
      const ethereumAssets = config?.config?.critical.assets;
      const bitcoinWalletAddresses =
        config?.config?.criticalBitcoin?.walletAddresses;

      if (bitcoinAssets && ethereumAssets && bitcoinWalletAddresses) {
        return isBridgeTransaction(tx, ethereumAssets, bitcoinAssets, [
          bitcoinWalletAddresses.btc,
          bitcoinWalletAddresses.avalanche,
        ]);
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private bitcoinAmount(amount: number, demonimation: number) {
    if (amount < 0) {
      amount = amount * -1;
    }
    return (amount / Math.pow(10, demonimation)).toString();
  }

  private isContractCall(tx: TransactionNormal | TransactionERC20) {
    return isTransactionNormal(tx) && tx.input !== '0x';
  }

  private txHistoryItemConverter(
    tx: TransactionNormal | TransactionERC20 | BitcoinHistoryTx,
    network: Network
  ): TxHistoryItem {
    if (isTransactionBitcoin(tx)) {
      const userAddress = this.accountsService.activeAccount?.addressBTC
        ? this.accountsService.activeAccount?.addressBTC
        : '';
      const txAddress = tx.addresses[0] ? tx.addresses[0] : '';
      const denomination = BITCOIN_NETWORK.networkToken.decimals;
      return {
        isBridge: this.isBridge(tx),
        isIncoming: !tx.isSender,
        isOutgoing: tx.isSender,
        isContractCall: false,
        timestamp: new Date(tx.receivedTime).toISOString(),
        hash: tx.hash,
        amount: this.bitcoinAmount(tx.amount, denomination),
        isSender: tx.isSender,
        from: tx.isSender ? userAddress : txAddress,
        to: tx.isSender ? txAddress : userAddress,
        token: {
          decimal: denomination.toString(),
          name: BITCOIN_NETWORK.networkToken.name,
          symbol: BITCOIN_NETWORK.networkToken.symbol,
        },
        explorerLink: getBTCBlockchainLink(
          tx.hash,
          network.chainId === BITCOIN_NETWORK.chainId
        ),
        chainId: network.chainId.toString(),
      };
    } else if (isTransactionERC20(tx)) {
      return {
        isBridge: this.isBridge(tx),
        isIncoming: !tx.isSender,
        isOutgoing: tx.isSender,
        isContractCall: this.isContractCall(tx),
        timestamp: tx.timestamp.toISOString(),
        hash: tx.hash,
        amount: tx.amountDisplayValue,
        isSender: tx.isSender,
        from: tx.from,
        to: tx.to,
        token: {
          decimal: tx.tokenDecimal,
          name: tx.tokenName,
          symbol: tx.tokenSymbol,
        },
        explorerLink: tx.explorerLink,
        chainId: network.chainId.toString(),
      };
    } else {
      return {
        isBridge: this.isBridge(tx),
        isIncoming: !tx.isSender,
        isOutgoing: tx.isSender,
        isContractCall: this.isContractCall(tx),
        timestamp: tx.timestamp.toISOString(),
        hash: tx.hash,
        amount: tx.amountDisplayValue,
        isSender: tx.isSender,
        from: tx.from,
        to: tx.to,
        token: {
          decimal: AVAX_TOKEN.decimals ? AVAX_TOKEN.decimals.toString() : '18',
          name: AVAX_TOKEN.name,
          symbol: AVAX_TOKEN.symbol,
        },
        explorerLink: tx.explorerLink,
        chainId: network.chainId.toString(),
      };
    }
  }

  async getEVMHistory(network: Network) {
    if (network?.vmName !== NetworkVMType.EVM) {
      return [];
    }
    const state = this.walletService.walletState;
    const txHistory = state ? state.recentTxHistory : [];
    const results: TxHistoryItem[] = [];
    txHistory.forEach((tx) => {
      const txHistoryItem = this.txHistoryItemConverter(tx, network);
      if (txHistoryItem) {
        results.push(txHistoryItem);
      }
    });

    return results;
  }

  async getBTCTxHistory(network: Network) {
    if (network?.vmName !== NetworkVMType.BITCOIN) {
      return [];
    }
    const account = this.accountsService.activeAccount?.addressBTC;

    if (!account) {
      return [];
    }
    const provider = this.networkService.getProviderForNetwork(
      network
    ) as BlockCypherProvider;

    try {
      const txHistory: BitcoinHistoryTx[] = await provider.getTxHistory(
        account
      );
      const results: TxHistoryItem[] = [];
      txHistory.forEach((tx) => {
        const converted = this.txHistoryItemConverter(tx, network);
        if (converted) {
          results.push(converted);
        }
      });
      return results;
    } catch (error) {
      return [];
    }
  }

  async getTxHistory() {
    const network = await this.networkService.activeNetwork.promisify();
    if (network) {
      switch (network.vmName) {
        case NetworkVMType.BITCOIN:
          return await this.getBTCTxHistory(network);
        default:
          return await this.getEVMHistory(network);
      }
    } else {
      return [];
    }
  }
}
