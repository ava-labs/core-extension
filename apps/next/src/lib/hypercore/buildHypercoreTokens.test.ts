import type { ClearinghouseState, SpotBalance } from './schemas';
import {
  buildHypercoreTokens,
  getPerpCollateralUsd,
  spotCountsAsPerpCollateral,
} from './buildHypercoreTokens';
import type { HypercoreSpotToken } from './spotTokens';
import { toHypercoreSpotTokens } from './spotTokens';

const spotBalance = (
  coin: string,
  token: number,
  total: string,
): SpotBalance => ({
  coin,
  token,
  total,
  hold: '0',
});

const clearinghouse = (
  accountValue: string,
  unrealizedPnls: string[] = [],
): ClearinghouseState => ({
  assetPositions: unrealizedPnls.map((unrealizedPnl) => ({
    position: { unrealizedPnl },
  })),
  crossMarginSummary: { accountValue },
});

const PURR: HypercoreSpotToken = {
  index: 5,
  name: 'Purr',
  symbol: 'PURR',
  decimals: 6,
  address: '0xabc0000000000000000000000000000000000001',
};

const CORE_ONLY: HypercoreSpotToken = {
  index: 7,
  name: 'Core Only',
  symbol: 'CORE',
  decimals: 4,
};

describe('spotCountsAsPerpCollateral', () => {
  it('is true only for unifiedAccount', () => {
    expect(spotCountsAsPerpCollateral('unifiedAccount')).toBe(true);
    expect(spotCountsAsPerpCollateral('default')).toBe(false);
    expect(spotCountsAsPerpCollateral('disabled')).toBe(false);
    expect(spotCountsAsPerpCollateral(undefined)).toBe(false);
  });
});

describe('getPerpCollateralUsd', () => {
  it('excludes positive unrealized PnL from account value', () => {
    // accountValue 50 = 40 collateral + 10 PnL
    expect(getPerpCollateralUsd(clearinghouse('50', ['10'])).toString()).toBe(
      '40',
    );
  });

  it('adds back losses so collateral reflects deposited margin', () => {
    // accountValue 50 = 60 collateral - 10 loss
    expect(getPerpCollateralUsd(clearinghouse('50', ['-10'])).toString()).toBe(
      '60',
    );
  });

  it('returns zero for no perp account', () => {
    expect(getPerpCollateralUsd(undefined).toString()).toBe('0');
  });

  it('clamps negative collateral to zero', () => {
    expect(getPerpCollateralUsd(clearinghouse('5', ['10'])).toString()).toBe(
      '0',
    );
  });
});

describe('toHypercoreSpotTokens', () => {
  it('maps spotMeta tokens and keeps valid EVM contract addresses', () => {
    const tokens = toHypercoreSpotTokens([
      {
        name: 'PURR',
        index: 5,
        weiDecimals: 6,
        fullName: 'Purr',
        evmContract: {
          address: '0xabc0000000000000000000000000000000000001',
        },
      },
      {
        name: 'CORE',
        index: 7,
        weiDecimals: 4,
        fullName: null,
      },
    ]);

    expect(tokens).toEqual([
      {
        index: 5,
        name: 'Purr',
        symbol: 'PURR',
        decimals: 6,
        address: '0xabc0000000000000000000000000000000000001',
      },
      {
        index: 7,
        name: 'CORE',
        symbol: 'CORE',
        decimals: 4,
        address: undefined,
      },
    ]);
  });
});

describe('buildHypercoreTokens', () => {
  it('folds perp collateral (PnL excluded) into the USDC holding for default accounts', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [spotBalance('USDC', 0, '100')],
      perpState: clearinghouse('50', ['10']),
      abstractionMode: 'default',
      spotTokens: [],
    });

    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.symbol).toBe('USDC');
    expect(tokens[0]?.kind).toBe('native');
    // 100 spot + (50 - 10 PnL) collateral
    expect(tokens[0]?.balance).toBe('140');
    expect(tokens[0]?.kind === 'native' && tokens[0].priceUsd).toBe(1);
    expect(tokens[0]?.kind === 'native' && tokens[0].balanceUsd).toBe('140');
  });

  it('does NOT add perp collateral for unified accounts (spot already backs perps)', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [spotBalance('USDC', 0, '100')],
      perpState: clearinghouse('50', ['10']),
      abstractionMode: 'unifiedAccount',
      spotTokens: [],
    });

    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.balance).toBe('100');
  });

  it('surfaces a USDC holding from perp collateral alone', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [],
      perpState: clearinghouse('40'),
      abstractionMode: 'default',
      spotTokens: [],
    });

    expect(tokens.map((token) => token.symbol)).toEqual(['USDC']);
    expect(tokens[0]?.balance).toBe('40');
  });

  it('omits USDC when neither spot nor collateral exist', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [spotBalance('PURR', 5, '12')],
      perpState: undefined,
      abstractionMode: 'default',
      spotTokens: [PURR],
    });

    expect(tokens.map((token) => token.symbol)).toEqual(['PURR']);
  });

  it('maps spot tokens by index and uses the bridged contract address', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [spotBalance('PURR', 5, '12.5')],
      perpState: undefined,
      abstractionMode: 'default',
      spotTokens: [PURR],
    });

    const purr = tokens[0];
    expect(purr?.symbol).toBe('PURR');
    expect(purr?.balance).toBe('12.5');
    expect(purr?.kind === 'erc20' && purr.address).toBe(PURR.address);
  });

  it('synthesizes a deterministic address for HyperCore-only tokens', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [spotBalance('CORE', 7, '1')],
      perpState: undefined,
      abstractionMode: 'default',
      spotTokens: [CORE_ONLY],
    });

    const core = tokens[0];
    expect(core?.kind === 'erc20' && core.address).toBe(
      '0x0000000000000000000000000000000000000007',
    );
  });

  it('skips zero balances and tokens missing from the registry', () => {
    const tokens = buildHypercoreTokens({
      spotBalances: [
        spotBalance('PURR', 5, '0'),
        spotBalance('UNKNOWN', 99, '5'),
      ],
      perpState: undefined,
      abstractionMode: 'default',
      spotTokens: [PURR],
    });

    expect(tokens).toHaveLength(0);
  });
});
