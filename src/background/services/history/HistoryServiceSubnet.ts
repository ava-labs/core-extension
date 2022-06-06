import { Network } from '@avalabs/chains-sdk';
import { balanceToDisplayValue, HttpClient } from '@avalabs/utils-sdk';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { BN } from 'bn.js';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { SubnetHistoryItem, TxHistoryItem } from './models';

const SUBNET_API_URL = 'https://subnet-explorer-api.avax.network/v1.1/';
const SUBNET_API_URL_TESTNET =
  'https://subnet-explorer-api.avax-test.network/v1.1/';

@singleton()
export class HistoryServiceSubnet {
  constructor(private accountsService: AccountsService) {}

  txHistoryItemConverter(
    network: Network,
    tx: SubnetHistoryItem,
    cChainAddress: string
  ): TxHistoryItem {
    const isSender = tx.from.toLowerCase() === cChainAddress.toLowerCase();
    const timestamp = new Date(tx.timestamp * 1000);

    const amountBN = new BN(tx.value);
    const decimals =
      tx.method === 'Native Transfer'
        ? network.networkToken.decimals
        : tx.toContract?.decimals;
    const amountDisplayValue =
      decimals && balanceToDisplayValue(amountBN, decimals);

    return {
      isBridge: false,
      isIncoming: !isSender,
      isOutgoing: isSender,
      isContractCall: !!tx.toContract,
      timestamp: timestamp.toISOString(),
      hash: tx.hash,
      amount: amountDisplayValue || tx.value,
      isSender,
      from: tx.from,
      to: tx.to,
      token:
        tx.method === 'Native Transfer'
          ? {
              decimal: `${network.networkToken.decimals}`,
              name: network.networkToken.name,
              symbol: network.networkToken.symbol,
            }
          : tx.toContract && {
              decimal: `${tx.toContract.decimals}`,
              name: tx.toContract.name,
              symbol: tx.toContract.symbol,
            },
      explorerLink: getExplorerAddressByNetwork(network, tx.hash),
      chainId: network.chainId.toString(),
    };
  }
  async getHistory(network: Network): Promise<TxHistoryItem[]> {
    const account = this.accountsService.activeAccount;
    if (!account) {
      return [];
    }
    const params = new URLSearchParams({
      address: account.addressC,
      sort: 'desc',
    });
    const history: { status: number; transactions: SubnetHistoryItem[] } =
      await new HttpClient(
        `${network.isTestnet ? SUBNET_API_URL_TESTNET : SUBNET_API_URL}`
      ).get(`${network.chainId}/transactions`, params);
    return history.transactions.map((tx) =>
      this.txHistoryItemConverter(network, tx, account.addressC)
    );
  }
}
