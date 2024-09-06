import { singleton } from 'tsyringe';
import { Network } from '@avalabs/core-chains-sdk';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { AccountsService } from '../accounts/AccountsService';
import {
  BlockchainId,
  ListXChainTransactionsResponse,
  Network as NetworkType,
  PChainTransaction,
  PrimaryNetworkChainName,
  SortOrder,
  XChainLinearTransaction,
  XChainNonLinearTransaction,
} from '@avalabs/glacier-sdk';
import { GlacierService } from '../glacier/GlacierService';
import { TxHistoryItemToken, XchainTxHistoryItem } from './models';
import Big from 'big.js';
import { getAvaxAssetId } from './utils/getAvaxAssetId';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { isXchainNetwork } from '../network/utils/isAvalancheXchainNetwork';
import { getTokenValue } from '../balances/utils/getTokenValue';
import { TokenType } from '@avalabs/vm-module-types';

@singleton()
export class HistoryServiceAVM {
  constructor(
    private accountsService: AccountsService,
    private glacierService: GlacierService
  ) {}

  isXchainTransactions(value): value is ListXChainTransactionsResponse {
    return value.chainInfo.chainName === PrimaryNetworkChainName.X_CHAIN;
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
    tx: XChainNonLinearTransaction | XChainLinearTransaction,
    network: Network,
    address: string
  ): XchainTxHistoryItem {
    const avax = network.networkToken;

    const isImportExport = ['ImportTx', 'ExportTx'].includes(tx.txType);
    const xBlockchainId = network.isTestnet
      ? Avalanche.FujiContext.xBlockchainID
      : Avalanche.MainnetContext.xBlockchainID;

    const importExportAmount = tx.emittedUtxos
      .filter(
        (utxo) =>
          utxo.asset.assetId === getAvaxAssetId(!!network.isTestnet) &&
          ((tx.txType === 'ImportTx' &&
            utxo.consumedOnChainId === xBlockchainId) ||
            (tx.txType === 'ExportTx' &&
              utxo.consumedOnChainId !== xBlockchainId))
      )
      .reduce((agg, utxo) => agg.add(utxo.asset.amount), new Big(0));

    const totalAmountCreated = tx.amountCreated
      .filter((asset) => asset.assetId === getAvaxAssetId(!!network.isTestnet))
      .reduce(
        (accumulator, asset) => accumulator.add(asset.amount),
        new Big(0)
      );
    const totalAmountUnlocked = tx.amountUnlocked
      .filter((asset) => asset.assetId === getAvaxAssetId(!!network.isTestnet))
      .reduce(
        (accumulator, asset) => accumulator.add(asset.amount),
        new Big(0)
      );

    const nAvaxAmt = isImportExport ? importExportAmount : totalAmountCreated;
    const avaxAmt = nAvaxAmt
      ? new Big(getTokenValue(avax.decimals, nAvaxAmt.toNumber()))
      : new Big(0);

    const froms = new Set(
      tx.consumedUtxos?.flatMap((utxo) => utxo.addresses) || []
    );
    const tos = new Set(
      tx.emittedUtxos?.flatMap((utxo) => utxo.addresses) || []
    );
    const nAvaxFee = totalAmountUnlocked.minus(totalAmountCreated);
    const avaxBurnedAmount = nAvaxFee
      ? new Big(getTokenValue(avax.decimals, nAvaxFee.toNumber()))
      : new Big(0);

    const isSender = froms.has(stripAddressPrefix(address));
    const timestamp = new Date(tx.timestamp * 1000);

    const token: TxHistoryItemToken = {
      decimal: avax.decimals.toString(),
      name: avax.name,
      symbol: avax.symbol,
      amount: avaxAmt?.toString() ?? '0',
      type: TokenType.NATIVE,
    };

    const result: XchainTxHistoryItem = {
      from: Array.from(froms),
      to: Array.from(tos),
      isSender,
      timestamp: timestamp.toISOString(),
      token,
      gasUsed: avaxBurnedAmount.toString(),
      explorerLink: getExplorerAddressByNetwork(network, tx.txHash, 'tx'),
      chainId: network.chainId.toString(),
      type: tx.txType,
      vmType: 'AVM',
    };

    return result;
  }

  async getHistory(network: Network, otherAddress?: string) {
    if (!network?.chainId || !isXchainNetwork(network)) {
      return [];
    }

    const address =
      otherAddress ?? this.accountsService.activeAccount?.addressAVM;

    if (!address) {
      return [];
    }

    const param = {
      blockchainId: (network.isTestnet
        ? Avalanche.FujiContext.xBlockchainID
        : Avalanche.MainnetContext.xBlockchainID) as BlockchainId,
      network: network.isTestnet ? NetworkType.FUJI : NetworkType.MAINNET,
      addresses: address,
      pageSize: 25,
      sortOrder: SortOrder.DESC,
    };

    try {
      const rawResult =
        await this.glacierService.listLatestPrimaryNetworkTransactions(param);

      if (!this.isXchainTransactions(rawResult)) {
        return [];
      }

      const formattedResult = rawResult.transactions.map((tx) =>
        this.convertToTxHistoryItem(tx, network, address)
      );

      return formattedResult;
    } catch {
      return [];
    }
  }
}
