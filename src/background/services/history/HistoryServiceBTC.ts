import { Blockchain } from '@avalabs/bridge-sdk';
import { BITCOIN_NETWORK, Network, NetworkVMType } from '@avalabs/chains-sdk';
import { BitcoinHistoryTx, BlockCypherProvider } from '@avalabs/wallets-sdk';
import { getExplorerAddress } from '@src/utils/getExplorerAddress';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { NetworkService } from '../network/NetworkService';
import { HistoryServiceBridgeHelper } from './HistoryServiceBridgeHelper';
import { TxHistoryItem } from './models';

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
    return {
      isBridge: this.bridgeHistoryHelperService.isBridgeTransactionBTC(tx),
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
      explorerLink: getExplorerAddress(
        Blockchain.BITCOIN,
        tx.hash,
        network.chainId === BITCOIN_NETWORK.chainId
      ),
      chainId: network.chainId.toString(),
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
}
