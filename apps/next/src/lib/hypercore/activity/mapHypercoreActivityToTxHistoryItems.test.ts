import { TokenType, TransactionType } from '@avalabs/vm-module-types';
import { mapHypercoreActivityToTxHistoryItems } from './mapHypercoreActivityToTxHistoryItems';
import type { HypercoreActivityItem } from './types';

const OWNER = '0x7962b519399e541f9c0d69ea2437916c243bb530';
const OTHER = '0xf70da97812cb96acdf810712aa562db8dfa3dbef';
const EXPLORER_NETWORK = {
  explorerUrl: 'https://app.hyperliquid.xyz/explorer',
};

describe('mapHypercoreActivityToTxHistoryItems', () => {
  it('maps fills to fill-order rows with trade meta', () => {
    const items: HypercoreActivityItem[] = [
      {
        kind: 'fill',
        timeMs: 1_700_000_000_000,
        hash: '0xfill',
        fill: {
          closedPnl: '1.5',
          coin: 'ETH',
          crossed: true,
          dir: 'Open Long',
          hash: '0xfill',
          oid: 1,
          px: '2000',
          side: 'B',
          startPosition: '0',
          sz: '0.1',
          time: 1_700_000_000_000,
        },
      },
    ];

    const [tx] = mapHypercoreActivityToTxHistoryItems(
      items,
      OWNER,
      EXPLORER_NETWORK,
    );

    expect(tx).toMatchObject({
      txType: TransactionType.FILL_ORDER,
      isIncoming: true,
      isSender: false,
      hash: '0xfill',
      explorerLink: `${EXPLORER_NETWORK.explorerUrl}/tx/0xfill`,
      tokens: [
        {
          type: TokenType.NATIVE,
          symbol: 'ETH',
          amount: '0.1',
        },
      ],
      bridgeAnalysis: { isBridgeTx: false },
    });
    expect(tx?.method).toContain('hypercoreFill:v1:');
  });

  it('stores unit USD price for ledger rows', () => {
    const items: HypercoreActivityItem[] = [
      {
        kind: 'ledger',
        timeMs: 1_700_000_000_000,
        hash: '0xsend',
        update: {
          time: 1_700_000_000,
          hash: '0xsend',
          delta: {
            type: 'send',
            amount: '0.1',
            token: 'USDC',
            usdcValue: '0.1',
            user: OWNER,
            destination: OTHER,
          },
        },
      },
    ];

    const [tx] = mapHypercoreActivityToTxHistoryItems(
      items,
      OWNER,
      EXPLORER_NETWORK,
    );

    expect(tx?.historyTokenUsdPrices?.USDC).toBe(1);
  });

  it('maps deposit ledger updates to receive rows', () => {
    const items: HypercoreActivityItem[] = [
      {
        kind: 'ledger',
        timeMs: 1_700_000_000_000,
        hash: '0xdep',
        update: {
          time: 1_700_000_000,
          hash: '0xdep',
          delta: { type: 'deposit', usdc: '5' },
        },
      },
    ];

    const [tx] = mapHypercoreActivityToTxHistoryItems(
      items,
      OWNER,
      EXPLORER_NETWORK,
    );

    expect(tx).toMatchObject({
      txType: TransactionType.RECEIVE,
      isIncoming: true,
      isSender: false,
      tokens: [{ symbol: 'USDC', amount: '5' }],
    });
  });

  it('maps outbound sends to send rows', () => {
    const items: HypercoreActivityItem[] = [
      {
        kind: 'ledger',
        timeMs: 1_700_000_000_000,
        hash: '0xsend',
        update: {
          time: 1_700_000_000,
          hash: '0xsend',
          delta: {
            type: 'send',
            amount: '2',
            token: 'USDC',
            usdcValue: '2',
            user: OWNER,
            destination: OTHER,
          },
        },
      },
    ];

    const [tx] = mapHypercoreActivityToTxHistoryItems(
      items,
      OWNER,
      EXPLORER_NETWORK,
    );

    expect(tx).toMatchObject({
      txType: TransactionType.SEND,
      isOutgoing: true,
      isSender: true,
      from: OWNER,
      to: OTHER,
    });
  });
});
