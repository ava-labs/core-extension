import { BN } from 'bn.js';
import { Network } from '@avalabs/chains-sdk';
import { Glacier, TransactionDetails } from '@avalabs/glacier-sdk';
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
import { getNftMetadata } from '@src/utils/getNftMetadata';
import { getSmallImageForNFT } from '../balances/nft/utils/getSmallImageForNFT';
import { resolve } from '@src/utils/promiseResolver';
import { TokenType } from '../balances/models';

@singleton()
export class HistoryServiceGlacier {
  private glacierSdkInstance = new Glacier({
    BASE: process.env.GLACIER_URL,
  });
  constructor(private accountsService: AccountsService) {}

  async getHistory(network: Network): Promise<TxHistoryItem[]> {
    const account = this.getAddress(network.chainId);

    if (!account) {
      return [];
    }

    try {
      const response =
        await this.glacierSdkInstance.evmTransactions.listTransactions({
          chainId: network.chainId.toString(),
          address: account,
          pageSize: 25,
        });

      const convertedItems = await Promise.all(
        response.transactions
          .filter(
            // Currently not showing failed tx
            (tranasaction) => tranasaction.nativeTransaction.txStatus === '1'
          )
          .map((transaction) =>
            this.convertToTxHistoryItem(transaction, network, account).then(
              (result) => result
            )
          )
      );

      const result = convertedItems.filter(
        // Filtering txs with 0 value since there is no change in balance
        (transaction) =>
          transaction.tokens.find((token) => Number(token.amount) !== 0)
      );

      return result;
    } catch (err) {
      return [];
    }
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

  private async getTokens(
    { nativeTransaction, erc20Transfers, erc721Transfers }: TransactionDetails,
    network: Network
  ): Promise<TxHistoryItemToken[]> {
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
        from: nativeTransaction.from,
        to: nativeTransaction.to,
        type: TokenType.NATIVE,
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
        from: erc20Transfer.from,
        to: erc20Transfer.to,
        imageUri: erc20Transfer.erc20Token.logoUri,
        type: TokenType.ERC20,
      });
    });

    if (erc721Transfers) {
      await Promise.all(
        erc721Transfers.map(async (erc721Transfer) => {
          const token = erc721Transfer.erc721Token;
          let imageUri: string;

          if (token.metadata.imageUri) {
            imageUri = token.metadata.imageUri;
          } else {
            const [metadata, error] = await resolve(
              getNftMetadata(token.tokenUri)
            );
            if (error) {
              imageUri = '';
            } else {
              imageUri = metadata.image
                ? await getSmallImageForNFT(metadata.image)
                : '';
            }
          }

          result.push({
            name: erc721Transfer.erc721Token.name,
            symbol: erc721Transfer.erc721Token.symbol,
            amount: '1',
            imageUri,
            from: erc721Transfer.from,
            to: erc721Transfer.to,
            collectableTokenId: erc721Transfer.erc721Token.tokenId,
            type: TokenType.ERC721,
          });
        })
      );
    }

    return result;
  }

  private async convertToTxHistoryItem(
    tx: TransactionDetails,
    network: Network,
    account: string
  ): Promise<TxHistoryItem> {
    const historyItemCategories = this.getHistoryItemCategories(tx, account);

    const { isOutgoing, isIncoming, isSender, from, to } = this.getSenderInfo(
      historyItemCategories,
      tx,
      account
    );

    const tokens = await this.getTokens(tx, network);

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
      from,
      to,
      tokens,
      gasPrice: tx.nativeTransaction.gasPrice,
      gasUsed: tx.nativeTransaction.gasUsed,
      explorerLink: getExplorerAddressByNetwork(
        network,
        tx.nativeTransaction.txHash
      ),
      chainId: network.chainId.toString(),
      type: historyItemCategories.type,
    };
  }
}
