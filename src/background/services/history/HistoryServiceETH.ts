import { isEthereumChainId } from '@src/background/services/network/utils/isEthereumNetwork';
import { Network } from '@avalabs/chains-sdk';

import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { HistoryServiceBridgeHelper } from './HistoryServiceBridgeHelper';
import { TxHistoryItem } from './models';

import { balanceToDisplayValue } from '@avalabs/utils-sdk';
import { BN } from 'bn.js';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import {
  Erc20Tx,
  getErc20Txs,
  getNormalTxs,
  NormalTx,
} from '@avalabs/etherscan-sdk';

@singleton()
export class HistoryServiceETH {
  constructor(
    private bridgeHistoryHelperService: HistoryServiceBridgeHelper,
    private accountsService: AccountsService
  ) {}

  private isContractCall(tx: NormalTx) {
    return tx.input !== '0x';
  }

  private convertTransactionERC20(
    tx: Erc20Tx,
    network: Network
  ): TxHistoryItem {
    const isSender =
      tx.from.toLowerCase() ===
      this.accountsService.activeAccount?.addressC.toLowerCase();
    const timestamp = new Date(parseInt(tx.timeStamp) * 1000);
    const decimals = parseInt(tx.tokenDecimal);
    const amountBN = new BN(tx.value);
    const amountDisplayValue = balanceToDisplayValue(amountBN, decimals);

    return {
      isBridge: this.bridgeHistoryHelperService.isBridgeTransactionEVM(
        tx,
        network
      ),
      isIncoming: !isSender,
      isOutgoing: isSender,
      isContractCall: false,
      timestamp: timestamp.toISOString(),
      hash: tx.hash,
      amount: amountDisplayValue,
      isSender: isSender,
      from: tx.from,
      to: tx.to,
      token: {
        decimal: tx.tokenDecimal,
        name: tx.tokenName,
        symbol: tx.tokenSymbol,
      },
      explorerLink: getExplorerAddressByNetwork(network, tx.hash),
      chainId: network.chainId.toString(),
    };
  }

  private convertTransactionNormal(
    tx: NormalTx,
    network: Network
  ): TxHistoryItem {
    const isSender =
      tx.from.toLowerCase() ===
      this.accountsService.activeAccount?.addressC.toLowerCase();
    const timestamp = new Date(parseInt(tx.timeStamp) * 1000);
    const amountBN = new BN(tx.value);
    const amountDisplayValue = balanceToDisplayValue(
      amountBN,
      network.networkToken.decimals
    );

    return {
      isBridge: false,
      isIncoming: !isSender,
      isOutgoing: isSender,
      isContractCall: this.isContractCall(tx),
      timestamp: timestamp.toISOString(),
      hash: tx.hash,
      amount: amountDisplayValue,
      isSender: isSender,
      from: tx.from,
      to: tx.to,
      token: {
        decimal: network.networkToken.decimals
          ? network.networkToken.decimals.toString()
          : '18',
        name: network.networkToken.name,
        symbol: network.networkToken.symbol,
      },
      explorerLink: getExplorerAddressByNetwork(network, tx.hash),
      chainId: network.chainId.toString(),
    };
  }

  async getHistory(network: Network) {
    if (!network?.chainId || !isEthereumChainId(network.chainId)) {
      return [];
    }

    const account = this.accountsService.activeAccount?.addressC;

    if (!account) {
      return [];
    }

    return await this.getHistoryInterleaved(account, network);
  }

  private async getHistoryInterleaved(
    userAddress: string,
    network: Network,
    page = 0,
    offset = 0
  ) {
    const normalHist = (
      await getNormalTxs(userAddress, !network.isTestnet, { page, offset })
    ).map((tx) => this.convertTransactionNormal(tx, network));

    const erc20Hist = (
      await getErc20Txs(userAddress, !network.isTestnet, undefined, {
        page,
        offset,
      })
    ).map((tx) => this.convertTransactionERC20(tx, network));

    // Filter erc20 transactions from normal tx list
    const erc20TxHashes = erc20Hist.map((tx) => tx.hash);
    const filteredNormalTxs = normalHist.filter((tx) => {
      return !erc20TxHashes.includes(tx.hash);
    });

    // Sort by timestamp
    const joined = [...filteredNormalTxs, ...erc20Hist];
    return joined.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}
