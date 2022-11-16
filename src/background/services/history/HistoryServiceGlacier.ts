import { BN } from 'bn.js';
import { Network } from '@avalabs/chains-sdk';
import { GlacierClient, TransactionDetails } from '@avalabs/glacier-sdk';
import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { startCase } from 'lodash';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { isBitcoinChainId } from '../network/utils/isBitcoinNetwork';
import {
  HistoryItemCategories,
  NonContractCallTypes,
  TransactionType,
  TxHistoryItem,
  TxHistoryItemToken,
} from './models';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { balanceToDisplayValue } from '@avalabs/utils-sdk';

@singleton()
export class HistoryServiceGlacier {
  private glacierSdkInstance = new GlacierClient(
    process.env.GLACIER_URL as string
  );
  constructor(private accountsService: AccountsService) {}

  async getHistory(network: Network): Promise<TxHistoryItem[]> {
    const account = this.getAddress(network.chainId);

    if (!account) {
      return [];
    }

    const response = await this.glacierSdkInstance.listTransactions(
      network.chainId.toString(),
      account,
      { pageSize: 25 }
    );

    const result = response.transactions
      .filter(
        // Currently not showing failed tx
        (tranasaction) => tranasaction.nativeTransaction.txStatus === '1'
      )
      .map((transaction) =>
        this.convertToTxHistoryItem(transaction, network, account)
      )
      .filter(
        // Filtering txs with 0 value since there is no change in balance
        (transaction) => transaction.amount !== '0'
      );

    return result;
  }

  private getAddress(chainId: number) {
    return isBitcoinChainId(chainId)
      ? this.accountsService.activeAccount?.addressBTC
      : this.accountsService.activeAccount?.addressC;
  }

  private parseRawMethod(method = '') {
    if (method.includes('(')) {
      return startCase(method.split('(', 1)[0]);
    }

    return method;
  }

  private getHistoryItemCategories(
    { nativeTransaction, erc20Transfers, erc721Transfers }: TransactionDetails,
    address: string
  ): HistoryItemCategories {
    const nativeOnly = !erc20Transfers && !erc721Transfers;
    const method = this.parseRawMethod(nativeTransaction.method?.methodName);

    const isBridge = erc20Transfers?.[0]?.from?.address === ETHEREUM_ADDRESS;
    const isSwap = method.toLowerCase().includes('swap');
    const isNativeSend =
      nativeOnly && nativeTransaction.from.address === address;
    const isNativeReceive =
      nativeOnly && nativeTransaction.to.address === address;
    const isNFTPurchase =
      method === 'Market Buy Orders With Eth' || method === 'Buy NFT';
    const isApprove = method === 'Approve';
    const isTransfer = method.toLowerCase().includes('transfer');
    const isAirdrop = method.toLowerCase().includes('airdrop');
    const isUnwrap = method.toLowerCase().includes('unwrap');
    const isFillOrder = method === 'Fill Order';
    const type = isBridge
      ? TransactionType.BRIDGE
      : isSwap
      ? TransactionType.SWAP
      : isNativeSend
      ? TransactionType.SEND
      : isNativeReceive
      ? TransactionType.RECEIVE
      : isNFTPurchase
      ? TransactionType.NFT_BUY
      : isApprove
      ? TransactionType.APPROVE
      : isTransfer
      ? TransactionType.TRANSFER
      : TransactionType.UNKNOWN;
    const isContractCall = !NonContractCallTypes.includes(type);

    return {
      isBridge,
      isSwap,
      isNativeSend,
      isNativeReceive,
      isNFTPurchase,
      isApprove,
      isTransfer,
      isAirdrop,
      isUnwrap,
      isFillOrder,
      isContractCall,
      method,
      type,
    };
  }

  private getSenderInfo(
    { isNativeSend, isNativeReceive, isTransfer }: HistoryItemCategories,
    { nativeTransaction, erc20Transfers, erc721Transfers }: TransactionDetails,
    address: string
  ) {
    let from = nativeTransaction?.from?.address;
    let to = nativeTransaction?.to?.address;

    // Until multi tokens transaction is supported in UI, using from and to of the only token is helpful for UI
    if (isTransfer && erc20Transfers && erc20Transfers[0]) {
      from = erc20Transfers[0].from.address;
      to = erc20Transfers[0].to.address;
    }

    if (isTransfer && erc721Transfers && erc721Transfers[0]) {
      from = erc721Transfers[0].from.address;
      to = erc721Transfers[0].to.address;
    }

    const isOutgoing = isNativeSend || (isTransfer && from === address);
    const isIncoming = isNativeReceive || (isTransfer && to === address);

    const isSender = from === address;

    return {
      isOutgoing,
      isIncoming,
      isSender,
      from,
      to,
    };
  }

  private getTokens(
    { nativeTransaction, erc20Transfers, erc721Transfers }: TransactionDetails,
    network: Network
  ): TxHistoryItemToken[] {
    const result: TxHistoryItemToken[] = [];

    if (nativeTransaction.value !== '0') {
      const decimal = network.networkToken.decimals ?? 18;
      const amountBN = new BN(nativeTransaction.value);
      const amountDisplayValue = balanceToDisplayValue(amountBN, decimal);
      result.push({
        decimal: decimal.toString(),
        name: network.networkToken.name,
        symbol: network.networkToken.symbol,
        amount: amountDisplayValue,
      });
    }

    erc20Transfers?.forEach((erc20Transfer) => {
      const decimals = erc20Transfer.erc20Token.decimals;
      const amountBN = new BN(erc20Transfer.value);
      const amountDisplayValue = balanceToDisplayValue(amountBN, decimals);

      result.push({
        decimal: decimals.toString(),
        name: erc20Transfer.erc20Token.name,
        symbol: erc20Transfer.erc20Token.symbol,
        amount: amountDisplayValue,
      });
    });

    erc721Transfers?.forEach((erc721Transfer) => {
      result.push({
        name: erc721Transfer.erc721Token.name,
        symbol: erc721Transfer.erc721Token.symbol,
        amount: '1',
      });
    });

    return result;
  }

  private convertToTxHistoryItem(
    tx: TransactionDetails,
    network: Network,
    account: string
  ): TxHistoryItem {
    const historyItemCategories = this.getHistoryItemCategories(tx, account);

    const { isOutgoing, isIncoming, isSender, from, to } = this.getSenderInfo(
      historyItemCategories,
      tx,
      account
    );

    const tokens = this.getTokens(tx, network);
    const token = tokens[0]; // Currently we are not displaying any TX details that has multiple tokens.
    const amount = token?.amount ?? '0';

    return {
      isBridge: historyItemCategories.isBridge,
      isContractCall: historyItemCategories.isContractCall,
      isIncoming,
      isOutgoing,
      isSender,
      timestamp: new Date(
        tx.nativeTransaction.blockTimestamp * 1000
      ).toISOString(), // s to ms
      hash: tx.nativeTransaction.txHash,
      amount,
      from,
      to,
      token,
      explorerLink: getExplorerAddressByNetwork(
        network,
        tx.nativeTransaction.txHash
      ),
      chainId: network.chainId.toString(),
    };
  }
}
