import { singleton } from 'tsyringe';
import { Network } from '@avalabs/chains-sdk';
import { Avalanche } from '@avalabs/wallets-sdk';
import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { AccountsService } from '../accounts/AccountsService';
import {
  BlockchainId,
  ListPChainTransactionsResponse,
  Network as NetworkType,
  PChainTransaction,
  PrimaryNetworkChainName,
  SortOrder,
} from '@avalabs/glacier-sdk';
import { GlacierService } from '../glacier/GlacierService';
import { PchainTxHistoryItem, TxHistoryItemToken } from './models';
import Big from 'big.js';
import { getAvaxAssetId } from './utils/getAvaxAssetId';
import { isEmpty } from 'lodash';
import { TokenType } from '../balances/models';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';

@singleton()
export class HistoryServicePVM {
  constructor(
    private accountsService: AccountsService,
    private glacierService: GlacierService
  ) {}

  isPchainTransactions(value): value is ListPChainTransactionsResponse {
    return value.chainInfo.chainName === PrimaryNetworkChainName.P_CHAIN;
  }

  aggregateValue(
    value: PChainTransaction['value'],
    isTestnet: boolean
  ): Big | undefined {
    return value
      .filter((value_) => value_.assetId === getAvaxAssetId(isTestnet))
      .reduce(
        (accumulator, value_) => accumulator.add(value_.amount),
        new Big(0)
      );
  }

  convertToTxHistoryItem(
    tx: PChainTransaction,
    network: Network,
    address: string
  ): PchainTxHistoryItem {
    const avax = network.networkToken;

    const froms = new Set(
      tx.consumedUtxos.flatMap((utxo) => utxo.addresses) || []
    );
    const tos = new Set(
      tx.emittedUtxos.flatMap((utxo) => utxo.addresses) || []
    );

    const isImportExport = ['ImportTx', 'ExportTx'].includes(tx.txType);
    const isBaseTx = tx.txType === 'BaseTx';

    const nonChangeEmittedUtxosAmt = tx.emittedUtxos
      .filter(
        (utxo) =>
          utxo.asset.assetId === getAvaxAssetId(!!network.isTestnet) &&
          !utxo.addresses.some((addr) => froms.has(addr))
      )
      .reduce((agg, utxo) => agg.add(utxo.asset.amount), new Big(0));
    const txValue = tx.value.find(
      (val) => val.assetId === getAvaxAssetId(!!network.isTestnet)
    )?.amount;
    // This ternary attempts to cover the case where users send themselves AVAX
    // in which case the senders are the recipients and we should use the total tx value.
    const baseTxValue = nonChangeEmittedUtxosAmt.gt(new Big(0))
      ? nonChangeEmittedUtxosAmt
      : txValue
      ? new Big(txValue)
      : new Big(0) ?? new Big(0);

    const pBlockchainId = network.isTestnet
      ? Avalanche.FujiContext.pBlockchainID
      : Avalanche.MainnetContext.pBlockchainID;

    const importExportAmount = tx.emittedUtxos
      .filter(
        (utxo) =>
          utxo.asset.assetId === getAvaxAssetId(!!network.isTestnet) &&
          ((tx.txType === 'ImportTx' &&
            utxo.consumedOnChainId === pBlockchainId) ||
            (tx.txType === 'ExportTx' &&
              utxo.consumedOnChainId !== pBlockchainId))
      )
      .reduce((agg, utxo) => agg.add(utxo.amount), new Big(0));

    const nAvaxAmt = isBaseTx
      ? baseTxValue
      : isImportExport
      ? importExportAmount
      : isEmpty(tx.amountStaked)
      ? this.aggregateValue(tx.value, !!network.isTestnet)
      : this.aggregateValue(tx.amountStaked, !!network.isTestnet);

    const avaxAmt = nAvaxAmt ? nAvaxAmt.div(10 ** avax.decimals) : new Big(0);

    const nAvaxFee = tx.amountBurned
      ?.filter((value) => value.assetId === getAvaxAssetId(!!network.isTestnet))
      .reduce(
        (accumulator, value) => accumulator.add(value.amount),
        new Big(0)
      );
    const avaxBurnedAmount = nAvaxFee
      ? nAvaxFee.div(10 ** avax.decimals)
      : new Big(0);

    const isSender = froms.has(stripAddressPrefix(address));
    const timestamp = new Date(tx.blockTimestamp * 1000);

    const token: TxHistoryItemToken = {
      decimal: avax.decimals.toString(),
      name: avax.name,
      symbol: avax.symbol,
      amount: avaxAmt?.toString() ?? '0',
      type: TokenType.NATIVE,
    };

    const result = {
      from: Array.from(froms),
      to: Array.from(tos),
      isSender,
      timestamp: timestamp.toISOString(),
      token,
      gasUsed: avaxBurnedAmount.toString(),
      explorerLink: getExplorerAddressByNetwork(network, tx.txHash, 'tx'),
      chainId: network.chainId.toString(),
      type: tx.txType,
    };

    return result;
  }

  async getHistory(network: Network) {
    if (!network?.chainId || !isPchainNetwork(network)) {
      return [];
    }

    const account = this.accountsService.activeAccount?.addressPVM;

    if (!account) {
      return [];
    }

    const param = {
      blockchainId: (network.isTestnet
        ? Avalanche.FujiContext.pBlockchainID
        : Avalanche.MainnetContext.pBlockchainID) as BlockchainId,
      network: network.isTestnet ? NetworkType.FUJI : NetworkType.MAINNET,
      addresses: account,
      pageSize: 25,
      sortOrder: SortOrder.DESC,
    };

    try {
      const rawResult =
        await this.glacierService.listLatestPrimaryNetworkTransactions(param);

      if (!this.isPchainTransactions(rawResult)) {
        return [];
      }

      const formattedResult = rawResult.transactions.map((tx) =>
        this.convertToTxHistoryItem(tx, network, account)
      );

      return formattedResult;
    } catch {
      return [];
    }
  }
}
