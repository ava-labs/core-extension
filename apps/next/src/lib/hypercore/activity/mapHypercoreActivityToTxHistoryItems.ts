import { TokenType, TransactionType } from '@avalabs/vm-module-types';
import type { Network } from '@avalabs/core-chains-sdk';
import type { TxHistoryItem } from '@core/types';
import {
  chainIdToCaip,
  getExplorerAddressByNetwork,
  HYPERCORE_CHAIN_ID,
} from '@core/common';
import { hyperliquidCoinSvgUrl } from '../hyperliquidCoinSvgUrl';
import type { HypercoreLedgerUpdate, UserFill } from '../schemas';
import { getHypercoreLedgerDisplay } from './getHypercoreLedgerDisplay';
import { encodeHypercoreFillMethod, tickerOfCoin } from './hypercoreFillMeta';
import type { HypercoreActivityItem } from './types';
import { toTimeMs } from './types';

const NOT_BRIDGE = { isBridgeTx: false } as const;

const unitUsdPrice = (amount: string, usdTotal: number | undefined) => {
  if (usdTotal === undefined) {
    return undefined;
  }
  const amountNum = Math.abs(Number(amount));
  if (!Number.isFinite(amountNum) || amountNum === 0) {
    return Math.abs(usdTotal);
  }
  return Math.abs(usdTotal) / amountNum;
};

const mapFillToTxHistoryItem = (
  fill: UserFill,
  timeMs: number,
  network: Pick<Network, 'explorerUrl'>,
): TxHistoryItem => {
  const isBuy = fill.side === 'B';
  const ticker = tickerOfCoin(fill.coin);

  return {
    isContractCall: false,
    isIncoming: isBuy,
    isOutgoing: !isBuy,
    isSender: !isBuy,
    timestamp: timeMs,
    hash: fill.hash,
    from: '',
    to: '',
    tokens: [
      {
        type: TokenType.NATIVE,
        name: fill.coin,
        symbol: ticker,
        amount: fill.sz,
        imageUri: hyperliquidCoinSvgUrl(fill.coin),
      },
    ],
    gasUsed: '0',
    txType: TransactionType.FILL_ORDER,
    method: encodeHypercoreFillMethod({
      dir: fill.dir ?? '',
      px: fill.px,
      closedPnl: fill.closedPnl,
      coin: fill.coin,
    }),
    chainId: chainIdToCaip(HYPERCORE_CHAIN_ID),
    explorerLink: getExplorerAddressByNetwork(network, fill.hash),
    bridgeAnalysis: NOT_BRIDGE,
  };
};

const mapLedgerToTxHistoryItem = (
  update: HypercoreLedgerUpdate,
  evmAddress: string,
  network: Pick<Network, 'explorerUrl'>,
): TxHistoryItem => {
  const display = getHypercoreLedgerDisplay(update, evmAddress);
  const isIncoming = display.direction === 'positive';
  const isOutgoing = display.direction === 'negative';

  let txType: TransactionType = TransactionType.TRANSFER;
  switch (display.label) {
    case 'deposit':
    case 'received':
      txType = TransactionType.RECEIVE;
      break;
    case 'withdraw':
    case 'sent':
      txType = TransactionType.SEND;
      break;
    case 'liquidation':
      txType = TransactionType.UNKNOWN;
      break;
    default:
      txType = TransactionType.TRANSFER;
  }

  const amount = display.amount || '0';
  const unitPrice = unitUsdPrice(amount, display.usdValue);

  return {
    isContractCall: false,
    isIncoming,
    isOutgoing,
    isSender: isOutgoing,
    timestamp: toTimeMs(update.time),
    hash: update.hash,
    from: display.from ?? (isOutgoing ? evmAddress : ''),
    to: display.to ?? (isIncoming ? evmAddress : ''),
    tokens: [
      {
        type: TokenType.NATIVE,
        name: display.symbol,
        symbol: display.symbol,
        amount,
        imageUri: hyperliquidCoinSvgUrl(display.symbol),
      },
    ],
    gasUsed: '0',
    txType,
    chainId: chainIdToCaip(HYPERCORE_CHAIN_ID),
    explorerLink: getExplorerAddressByNetwork(network, update.hash),
    bridgeAnalysis: NOT_BRIDGE,
    historyTokenUsdPrices:
      unitPrice !== undefined ? { [display.symbol]: unitPrice } : undefined,
  };
};

export const mapHypercoreActivityToTxHistoryItems = (
  items: readonly HypercoreActivityItem[],
  evmAddress: string,
  network: Pick<Network, 'explorerUrl'>,
): TxHistoryItem[] =>
  items.map((item) =>
    item.kind === 'fill'
      ? mapFillToTxHistoryItem(item.fill, item.timeMs, network)
      : mapLedgerToTxHistoryItem(item.update, evmAddress, network),
  );
