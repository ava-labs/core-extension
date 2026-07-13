import { HYPERCORE_CHAIN_ID } from '@core/common';
import type { NetworkWithCaipId } from '@core/types';
import type { HypercoreTokenBalance } from '@/lib/hypercore/buildHypercoreTokens';
import { sumHypercoreTokensInCurrency } from './useHypercoreBalanceInCurrency';

const hypercoreNetwork = {
  chainId: HYPERCORE_CHAIN_ID,
  caipId: `eip155:${HYPERCORE_CHAIN_ID}`,
} as NetworkWithCaipId;

const usdcToken: HypercoreTokenBalance = {
  kind: 'native',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 8,
  balance: '20.34',
  balanceRaw: '2034000000',
  balanceUsd: '20.34',
  priceUsd: 1,
};

describe('sumHypercoreTokensInCurrency', () => {
  it('sums priced HyperCore tokens when the network is enabled', () => {
    expect(
      sumHypercoreTokensInCurrency({
        hypercoreTokens: [usdcToken],
        hypercoreNetwork,
        isHypercoreEnabled: true,
      }),
    ).toBe(20.34);
  });

  it('returns 0 when HyperCore is disabled or network is missing', () => {
    expect(
      sumHypercoreTokensInCurrency({
        hypercoreTokens: [usdcToken],
        hypercoreNetwork,
        isHypercoreEnabled: false,
      }),
    ).toBe(0);

    expect(
      sumHypercoreTokensInCurrency({
        hypercoreTokens: [usdcToken],
        hypercoreNetwork: undefined,
        isHypercoreEnabled: true,
      }),
    ).toBe(0);
  });
});
