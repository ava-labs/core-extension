import { Blockchain } from '@avalabs/core-bridge-sdk';
import {
  BITCOIN_NETWORK,
  Network,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { BitcoinHistoryTx, BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { getExplorerAddress } from '@src/utils/getExplorerAddress';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { TokenType } from '../balances/models';
import { NetworkService } from '../network/NetworkService';
import { HistoryServiceBridgeHelper } from './HistoryServiceBridgeHelper';
import { TransactionType, TxHistoryItem } from './models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

@singleton()
export class HistoryServiceBTC {
  constructor(
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private bridgeHistoryHelperService: HistoryServiceBridgeHelper
  ) {}

  private bitcoinAmount(amount: number, demonimation: number) {
    if (amount < 0) {
      amount = amount * -1;
    }
    return (amount / Math.pow(10, demonimation)).toString();
  }

  private txHistoryItemConverter(
    tx: BitcoinHistoryTx,
    network: Network
  ): TxHistoryItem {
    const userAddress = this.accountsService.activeAccount?.addressBTC
      ? this.accountsService.activeAccount?.addressBTC
      : '';
    const txAddress = tx.addresses[0] ? tx.addresses[0] : '';
    const denomination = BITCOIN_NETWORK.networkToken.decimals;
    const isBridge = this.bridgeHistoryHelperService.isBridgeTransactionBTC(tx);
    const type = isBridge
      ? TransactionType.BRIDGE
      : tx.isSender
      ? TransactionType.SEND
      : TransactionType.RECEIVE;
    return {
      isBridge,
      isIncoming: !tx.isSender,
      isOutgoing: tx.isSender,
      isContractCall: false,
      timestamp: new Date(tx.receivedTime * 1000).toISOString(),
      hash: tx.hash,
      isSender: tx.isSender,
      from: tx.isSender ? userAddress : txAddress,
      to: tx.isSender ? txAddress : userAddress,
      tokens: [
        {
          decimal: denomination.toString(),
          name: BITCOIN_NETWORK.networkToken.name,
          symbol: BITCOIN_NETWORK.networkToken.symbol,
          amount: this.bitcoinAmount(tx.amount, denomination),
          type: TokenType.NATIVE,
        },
      ],
      gasUsed: tx.fee.toString(),
      explorerLink: getExplorerAddress(
        Blockchain.BITCOIN,
        tx.hash,
        network.chainId === BITCOIN_NETWORK.chainId
      ),
      chainId: network.chainId.toString(),
      type,
    };
  }

  async getHistory(network: Network): Promise<TxHistoryItem[]> {
    if (network?.vmName !== NetworkVMType.BITCOIN) {
      return [];
    }
    const account = this.accountsService.activeAccount?.addressBTC;

    if (!account) {
      return [];
    }
    const provider = getProviderForNetwork(network) as BitcoinProvider;

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
}
