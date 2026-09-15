import { TokenType } from '@avalabs/vm-module-types';
import { FungibleTokenBalance } from '@core/types';
import { getAvailableBalance } from './getAvailableBalance';

const base = {
  type: TokenType.NATIVE as const,
  name: 'Avalanche',
  symbol: 'AVAX',
  decimals: 9,
  balanceDisplayValue: '',
  coingeckoId: '',
};

const pChainToken = (over: { balance: bigint; available?: bigint }) =>
  ({
    ...base,
    assetType: 'pvm_native',
    ...over,
  }) as unknown as FungibleTokenBalance;

const xChainToken = (over: { balance: bigint; available?: bigint }) =>
  ({
    ...base,
    assetType: 'avm_native',
    ...over,
  }) as unknown as FungibleTokenBalance;

const evmToken = (over: { balance: bigint }) =>
  ({
    ...base,
    decimals: 18,
    assetType: 'native',
    ...over,
  }) as unknown as FungibleTokenBalance;

describe('getAvailableBalance', () => {
  it('uses `available` for a P-chain token, not the total balance', () => {
    // `balance` covers every category, including staked and platform-locked funds.
    const token = pChainToken({ balance: 100n, available: 40n });

    expect(getAvailableBalance(token, false)).toBe(40n);
  });

  it('reports zero for a P-chain wallet whose funds are all locked', () => {
    const token = pChainToken({ balance: 100n, available: 0n });

    expect(getAvailableBalance(token, false)).toBe(0n);
  });

  it('does not fall back to the total balance when `available` is absent', () => {
    // A mapper that forgets `available` must surface as zero rather than offering
    // locked funds as spendable.
    const token = pChainToken({ balance: 100n });

    expect(getAvailableBalance(token, false)).toBe(0n);
  });

  it('applies the same rule to X-chain tokens', () => {
    expect(
      getAvailableBalance(
        xChainToken({ balance: 100n, available: 25n }),
        false,
      ),
    ).toBe(25n);
    expect(getAvailableBalance(xChainToken({ balance: 100n }), false)).toBe(0n);
  });

  it('uses the full balance for non-XP tokens, which have no locked categories', () => {
    expect(getAvailableBalance(evmToken({ balance: 100n }), false)).toBe(100n);
  });

  it('formats the available amount, not the total', () => {
    const token = pChainToken({
      balance: 100_000_000_000n,
      available: 1_000_000_000n,
    });

    expect(getAvailableBalance(token, true)).toBe('1');
  });
});
